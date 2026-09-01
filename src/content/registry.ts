import { chapters } from './chapters';
import type { TopicMeta, TopicModule, TopicPractice } from './types';
import { validateContent } from './validate';

const metadata = import.meta.glob<{ meta: TopicMeta }>('./topics/**/meta.ts', { eager: true });
const articles = import.meta.glob<TopicModule>('./topics/**/article.mdx');
// 面试答案、速查表和代码条目只服务专题页与三个汇总页，保持惰性并按专题各成一片：
// 读者打开一篇专题时只下载这一篇的那份，而不是全站的长文本。
const practices = import.meta.glob<{ practice: TopicPractice }>('./topics/**/practice.ts');

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

const practicesByKey = new Map(
  Object.entries(practices).map(([path, load]) => [contentKey(path, 'practice\\.ts'), load]),
);

export const topics = [...metadataByKey.values()].sort((a, b) => {
  const chapterOrder = chapters.findIndex(chapter => chapter.id === a.chapter) -
    chapters.findIndex(chapter => chapter.id === b.chapter);
  return chapterOrder || a.order - b.order;
});

// 内容合同由 `npm run test:content` 在构建前强制执行。生产环境不再于模块求值期抛错：
// 那发生在 React 渲染之前，RootErrorBoundary 接不住，用户看到的是白屏。
const issues = validateContent(topics, chapters);
if (issues.length) {
  const report = issues.map(issue => issue.message).join('\n');
  if (import.meta.env.DEV || import.meta.env.MODE === 'test') {
    throw new Error(report);
  }
  console.error('内容校验未通过，手册仍以现有专题渲染：\n' + report);
}

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

export async function loadPractice(slug: string) {
  const topic = getTopic(slug);
  const load = topic && practicesByKey.get(topic.chapter + '/' + topic.slug);
  if (!load) throw new Error('找不到专题的面试内容：' + slug);
  return (await load()).practice;
}

/** /interview、/reference 和 /code 需要全部专题的这份内容，并发取回后按目录顺序排列。 */
export async function loadAllPractices() {
  return Promise.all(topics.map(topic => loadPractice(topic.slug)));
}

export function getAdjacentTopics(slug: string) {
  const index = topics.findIndex(topic => topic.slug === slug);
  return {
    previous: index > 0 ? topics[index - 1] : undefined,
    next: index >= 0 && index < topics.length - 1 ? topics[index + 1] : undefined,
  };
}
