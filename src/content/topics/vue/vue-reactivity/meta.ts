import type { TopicMeta } from '../../../types';

export const meta: TopicMeta = {
  slug: 'vue-reactivity',
  chapter: 'vue',
  order: 1,
  title: 'Vue 3 响应式与依赖追踪',
  summary: '从 Proxy、effect、track 与 trigger 理解 Vue 如何收集依赖、触发更新，以及 ref 与 reactive 的边界。',
  level: '高频',
  minutes: 26,
  keywords: ['Vue 3', '响应式', 'Proxy', 'ref', 'reactive', 'computed'],
  prerequisites: ['prototype-inheritance'],
  related: ['vue-render-nexttick', 'composition-composables', 'state-architecture'],
  sources: [
    { label: 'Vue — Reactivity in Depth', href: 'https://vuejs.org/guide/extras/reactivity-in-depth.html' },
    { label: 'Vue — Reactivity API: Core', href: 'https://vuejs.org/api/reactivity-core.html' },
  ],
  searchText: 'Vue3 响应式 Proxy effect track trigger WeakMap dependency ref reactive computed watch shallowRef toRef 解构丢失响应式 identity 依赖收集 派发更新',
  hasCode: true,
};
