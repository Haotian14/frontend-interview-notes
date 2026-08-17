import { chapters } from './chapters';
import type { TopicMeta, TopicModule } from './types';
import { validateContent } from './validate';

const metadata = import.meta.glob<{ meta: TopicMeta }>('./topics/**/meta.ts', { eager: true });
const articles = import.meta.glob<TopicModule>('./topics/**/article.mdx');

function contentKey(path: string, fileName: string) {
  const match = path.match(new RegExp(`^\\./topics/([^/]+)/([^/]+)/${fileName}$`));
  if (!match) throw new Error('无法识别专题路径：' + path);
  return match[1] + '/' + match[2];
}

const metadataByKey = new Map(
  Object.entries(metadata).map(([path, module]) => [contentKey(path, 'meta\\.ts'), module.meta]),
);

const articlesByKey = new Map(
  Object.entries(articles).map(([path, load]) => [contentKey(path, 'article\\.mdx'), load]),
);

export const topics = [...metadataByKey.values()].sort((a, b) => {
  const chapterOrder = chapters.findIndex(chapter => chapter.id === a.chapter) -
    chapters.findIndex(chapter => chapter.id === b.chapter);
  return chapterOrder || a.order - b.order;
});

const issues = validateContent(topics, chapters);
if (issues.length) throw new Error(issues.map(issue => issue.message).join('\n'));

export function getTopic(slug: string) {
  return topics.find(topic => topic.slug === slug);
}

export function getChapterTopics(chapterId: string) {
  return topics.filter(topic => topic.chapter === chapterId);
}

export async function loadTopic(slug: string) {
  const topic = getTopic(slug);
  const load = topic && articlesByKey.get(topic.chapter + '/' + topic.slug);
  if (!load) throw new Error('找不到专题内容：' + slug);
  return load();
}

export function getAdjacentTopics(slug: string) {
  const index = topics.findIndex(topic => topic.slug === slug);
  return {
    previous: index > 0 ? topics[index - 1] : undefined,
    next: index >= 0 && index < topics.length - 1 ? topics[index + 1] : undefined,
  };
}
