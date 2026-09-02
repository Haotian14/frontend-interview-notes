import Fuse from 'fuse.js';
import type { FuseResult } from 'fuse.js';
import { getTopic, topics } from '../../content/registry';
import type { TopicMeta } from '../../content/types';

export type SearchSection = {
  slug: string;
  chapter: string;
  heading: string;
  hash: string;
  text: string;
};

export type SearchHit = {
  item: TopicMeta;
  score: number;
  /** 命中正文时给出的小节，用于展示摘录并深链到该标题。 */
  section?: {
    heading: string;
    hash: string;
    excerpt: string;
  };
};

/*
  正文索引有 666 条记录、约 460KB。静态 import 会把它压进 SearchDialog 那个
  分片，按一下搜索就要下载并解析 180KB gzip 的 JavaScript。改成动态 import
  后它自成一片：与对话框代码并行下载、单独缓存（正文没变时无需重新下载），
  而且对话框可以先用元数据结果渲染，索引到达后再补上正文命中。
*/
let sectionsPromise: Promise<SearchSection[]> | null = null;

export function loadSearchSections(): Promise<SearchSection[]> {
  sectionsPromise ??= import('../../generated/search-index.json')
    .then(module => module.default as SearchSection[]);
  return sectionsPromise;
}

/** 元数据索引：标题和关键词的匹配应当排在正文之前。 */
export function createSearchIndex(source: TopicMeta[]) {
  return new Fuse(source, {
    includeMatches: true,
    includeScore: true,
    threshold: 0.35,
    ignoreLocation: true,
    keys: [
      { name: 'title', weight: 0.45 },
      { name: 'keywords', weight: 0.25 },
      { name: 'summary', weight: 0.2 },
      { name: 'searchText', weight: 0.1 },
    ],
  });
}

/** 正文索引：阈值更严，避免长文本上的模糊匹配产生噪声。 */
export function createSectionIndex(source: SearchSection[]) {
  return new Fuse(source, {
    includeMatches: true,
    includeScore: true,
    threshold: 0.2,
    ignoreLocation: true,
    minMatchCharLength: 2,
    keys: [
      { name: 'heading', weight: 0.4 },
      { name: 'text', weight: 0.6 },
    ],
  });
}

const EXCERPT_RADIUS = 60;

/** 以第一处命中为中心裁一段摘录，比固定取开头更能说明为什么匹配。 */
function buildExcerpt(result: FuseResult<SearchSection>) {
  const { text } = result.item;
  const match = result.matches?.find(entry => entry.key === 'text');
  const start = match?.indices?.[0]?.[0] ?? 0;

  const from = Math.max(0, start - EXCERPT_RADIUS);
  const to = Math.min(text.length, start + EXCERPT_RADIUS * 2);

  return (from > 0 ? '…' : '') + text.slice(from, to).trim() + (to < text.length ? '…' : '');
}

let topicIndex: ReturnType<typeof createSearchIndex> | undefined;
let sectionIndex: ReturnType<typeof createSectionIndex> | undefined;
let indexedSections: SearchSection[] | undefined;

/**
 * sections 由调用方传入：索引是异步到达的，传空数组时只搜元数据，
 * 这样对话框在索引下载完成前也能用。
 */
export function searchTopics(query: string, sections: SearchSection[] = []): SearchHit[] {
  const normalized = query.trim();
  if (!normalized) return [];

  topicIndex ??= createSearchIndex(topics);
  if (indexedSections !== sections) {
    sectionIndex = createSectionIndex(sections);
    indexedSections = sections;
  }

  const hits = new Map<string, SearchHit>();

  for (const result of topicIndex.search(normalized)) {
    hits.set(result.item.slug, {
      item: result.item,
      score: result.score ?? 1,
    });
  }

  for (const result of sectionIndex!.search(normalized)) {
    const topic = getTopic(result.item.slug);
    if (!topic) continue;

    // 正文命中排在元数据命中之后：标题匹配通常更贴近意图。
    const score = (result.score ?? 1) + 0.2;
    const existing = hits.get(topic.slug);

    if (!existing) {
      hits.set(topic.slug, {
        item: topic,
        score,
        section: {
          heading: result.item.heading,
          hash: result.item.hash,
          excerpt: buildExcerpt(result),
        },
      });
      continue;
    }

    // 已经由标题或关键词命中的专题不再附加小节：那种查询要的是这篇专题本身，
    // 直接把人丢到正文中段反而不对。深链只用于纯正文命中。
    existing.score = Math.min(existing.score, score);
  }

  return [...hits.values()].sort((a, b) => a.score - b.score);
}
