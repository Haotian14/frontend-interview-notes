import type { TopicLevel } from './types';

export type TopicCatalogEntry = {
  slug: string;
  chapter: string;
  title: string;
  level: TopicLevel;
  minutes: number;
};

export const topicCatalog: TopicCatalogEntry[] = [
  { slug: 'semantic-accessibility', chapter: 'html-a11y', title: '语义化 HTML 与可访问性', level: '基础', minutes: 20 },
  { slug: 'stacking-context', chapter: 'css', title: '层叠上下文与 z-index', level: '高频', minutes: 24 },
  { slug: 'event-loop', chapter: 'javascript-async', title: '事件循环与任务队列', level: '高频', minutes: 24 },
  { slug: 'type-narrowing', chapter: 'typescript', title: '类型收窄与穷尽检查', level: '高频', minutes: 24 },
  { slug: 'render-state-snapshot', chapter: 'react', title: 'React 渲染与状态快照', level: '高频', minutes: 26 },
  { slug: 'rendering-pipeline', chapter: 'browser-network', title: '浏览器渲染流水线', level: '高频', minutes: 28 },
  { slug: 'http-cache', chapter: 'browser-network', title: 'HTTP 缓存与重新验证', level: '高频', minutes: 26 },
  { slug: 'testing-strategy', chapter: 'engineering', title: '前端测试策略与分层', level: '进阶', minutes: 24 },
];
