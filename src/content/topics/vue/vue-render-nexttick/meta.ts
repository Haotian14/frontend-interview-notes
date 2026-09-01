import type { TopicMeta } from '../../../types';

export const meta: TopicMeta = {
  slug: 'vue-render-nexttick',
  chapter: 'vue',
  order: 2,
  title: 'Vue 更新调度与 nextTick',
  summary: '理解组件更新为何会批处理、队列如何去重，以及 nextTick 能等待什么、不能保证什么。',
  level: '高频',
  minutes: 24,
  keywords: ['Vue 3', '渲染', '调度器', 'nextTick', '批处理', '虚拟 DOM'],
  prerequisites: ['vue-reactivity'],
  related: ['reconciliation-keys', 'event-loop', 'vue-reactivity'],
  sources: [
    { label: 'Vue — nextTick', href: 'https://vuejs.org/api/general.html#nexttick' },
    { label: 'Vue — Rendering Mechanism', href: 'https://vuejs.org/guide/extras/rendering-mechanism.html' },
  ],
  searchText: 'Vue 更新调度 nextTick job queue scheduler batch 微任务 DOM 更新 虚拟 DOM patch block tree patch flag keyed diff flush pre post sync',
  hasCode: true,
};
