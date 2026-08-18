import { chapters } from '../content/chapters';
import { topics } from '../content/registry';
import {
  CODE_PATH,
  HANDBOOK_PATH,
  HOME_PATH,
  INTERVIEW_PATH,
  KNOWLEDGE_MAP_PATH,
  REFERENCE_PATH,
  chapterPath,
  topicPath,
} from './paths';

export type PrerenderRoute = {
  path: string;
  title: string;
  description: string;
};

const SITE_NAME = '前端复习手册';

/**
 * 所有可预渲染的地址。内容全部在构建期确定，因此每条路由都能产出静态 HTML，
 * 同时作为 sitemap.xml 的来源。
 */
export function collectRoutes(): PrerenderRoute[] {
  const staticRoutes: PrerenderRoute[] = [
    {
      path: HOME_PATH,
      title: `${SITE_NAME} · Frontend Review`,
      description: '从基础原理到面试表达，一本完整、可检索的前端复习手册。',
    },
    {
      path: HANDBOOK_PATH,
      title: `完整手册目录 · ${SITE_NAME}`,
      description: `${chapters.length} 个章节、${topics.length} 篇专题的完整目录。`,
    },
    {
      path: KNOWLEDGE_MAP_PATH,
      title: `知识地图 · ${SITE_NAME}`,
      description: '章节与专题之间的前置和关联关系。',
    },
    {
      path: INTERVIEW_PATH,
      title: `面试训练场 · ${SITE_NAME}`,
      description: '按章节和难度筛选题目，用 90 秒讲清一个知识点。',
    },
    {
      path: CODE_PATH,
      title: `代码手册 · ${SITE_NAME}`,
      description: '索引每篇专题的最小验证：预期输入与可观察输出。',
    },
    {
      path: REFERENCE_PATH,
      title: `前端速查表 · ${SITE_NAME}`,
      description: '面试前快速唤醒概念的分类速查表。',
    },
  ];

  const chapterRoutes = chapters.map(chapter => ({
    path: chapterPath(chapter.id),
    title: `${chapter.title} · ${SITE_NAME}`,
    description: chapter.summary,
  }));

  const topicRoutes = topics.map(topic => ({
    path: topicPath(topic),
    title: `${topic.title} · ${SITE_NAME}`,
    description: topic.summary,
  }));

  return [...staticRoutes, ...chapterRoutes, ...topicRoutes];
}
