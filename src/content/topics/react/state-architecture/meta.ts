import type { TopicMeta } from '../../../types';

export const meta: TopicMeta = {
  slug: 'state-architecture',
  chapter: 'react',
  order: 5,
  title: '状态归属与 Context 边界',
  summary: '按状态的来源和生命周期决定它该放在哪里，区分服务端缓存、URL 状态、共享状态与局部状态。',
  level: '进阶',
  minutes: 24,
  keywords: ['状态管理', 'Context', '状态提升', '服务端状态', 'URL 状态'],
  prerequisites: ['react-performance'],
  related: ['react-performance', 'hooks-dependencies', 'reconciliation-keys'],
  sources: [
    { label: 'React — Choosing the State Structure', href: 'https://react.dev/learn/choosing-the-state-structure' },
    { label: 'React — Passing Data Deeply with Context', href: 'https://react.dev/learn/passing-data-deeply-with-context' },
  ],
  searchText: '状态管理 状态归属 状态提升 lifting state up Context Provider 重渲染 服务端状态 server state 缓存 URL 状态 查询参数 表单状态 全局状态 Redux Zustand useSyncExternalStore 单一数据源',
  hasCode: true,
};
