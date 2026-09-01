import type { TopicMeta } from '../../../types';

export const meta: TopicMeta = {
  slug: 'reconciliation-keys',
  chapter: 'react',
  order: 3,
  title: '协调算法与 key',
  summary: '讲清 React 按位置和类型复用状态的规则，解释 key 的真正职责以及用索引作 key 会带来什么后果。',
  level: '高频',
  minutes: 24,
  keywords: ['协调', 'reconciliation', 'key', '虚拟 DOM', '组件状态复用'],
  prerequisites: ['render-state-snapshot'],
  related: ['render-state-snapshot', 'hooks-dependencies', 'react-performance'],
  sources: [
    { label: 'React — Preserving and Resetting State', href: 'https://react.dev/learn/preserving-and-resetting-state' },
    { label: 'React — Rendering Lists', href: 'https://react.dev/learn/rendering-lists' },
  ],
  searchText: 'React 协调 reconciliation diff 虚拟 DOM key 索引 index 作为 key 状态复用 状态重置 同层比较 类型不同 卸载 重建 列表渲染 fragment 条件渲染 三元 组件位置',
  hasCode: true,
};
