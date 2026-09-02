import type { TopicMeta } from '../../../types';

export const meta: TopicMeta = {
  slug: 'render-state-snapshot',
  chapter: 'react',
  order: 1,
  title: 'React 渲染与状态快照',
  summary: '从渲染快照、更新队列和组件身份解释状态何时可见，以及如何避免冗余派生状态。',
  level: '高频',
  minutes: 26,
  keywords: ['渲染快照', '批处理', '组件身份', '派生状态'],
  prerequisites: ['closures-scope'],
  related: ['hooks-dependencies', 'reconciliation-keys'],
  sources: [
    { label: 'React — State as a Snapshot', href: 'https://react.dev/learn/state-as-a-snapshot' },
    { label: 'React — Queueing a Series of State Updates', href: 'https://react.dev/learn/queueing-a-series-of-state-updates' },
  ],
  searchText: 'React render snapshot 渲染快照 batching 批处理 update queue 更新队列 component identity 组件身份 tree position type key derived state 派生状态 functional update 函数式更新',
  hasCode: true,
};
