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
  prerequisites: ['type-narrowing'],
  related: ['type-narrowing'],
  sources: [
    { label: 'React — State as a Snapshot', href: 'https://react.dev/learn/state-as-a-snapshot' },
    { label: 'React — Queueing a Series of State Updates', href: 'https://react.dev/learn/queueing-a-series-of-state-updates' },
  ],
  searchText: 'React render snapshot 渲染快照 batching 批处理 update queue 更新队列 component identity 组件身份 tree position type key derived state 派生状态 functional update 函数式更新',
  hasCode: true,
  interview: {
    answer: 'React 每次渲染都会用当次 props 和 state 计算一个 UI 快照；事件处理函数也闭包住这次快照，所以调用 setState 不会改写正在执行的变量，而是把更新加入队列。React 通常在事件处理结束后批处理这些更新：直接更新会基于同一个旧快照计算，函数式更新则按队列依次接收前一个结果。状态属于组件在树中的位置，类型或 key 改变会重置该位置的状态。能由当前 props 与 state 纯计算出的值应在渲染期计算，避免用 effect 同步出第二份容易失真的派生状态。',
    followUps: [
      '为什么连续调用三次 setCount(count + 1) 通常只增加一次？',
      'React 依据什么决定保留还是重置组件状态？',
      '什么时候可以把派生结果保存在 state 中？',
    ],
  },
};
