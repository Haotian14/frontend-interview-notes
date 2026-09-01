import type { TopicMeta } from '../../../types';

export const meta: TopicMeta = {
  slug: 'pinia-state-architecture',
  chapter: 'vue',
  order: 4,
  title: 'Pinia 状态设计与边界',
  summary: '区分服务端缓存、URL、局部状态和真正的跨页面客户端状态，让 Pinia 只承担它该承担的部分。',
  level: '进阶',
  minutes: 24,
  keywords: ['Pinia', '状态管理', 'storeToRefs', 'SSR', '服务端状态'],
  prerequisites: ['composition-composables'],
  related: ['state-architecture', 'web-storage-cookies', 'vue-reactivity'],
  sources: [
    { label: 'Pinia — Core Concepts', href: 'https://pinia.vuejs.org/core-concepts/' },
    { label: 'Pinia — Server Side Rendering', href: 'https://pinia.vuejs.org/ssr/' },
  ],
  searchText: 'Pinia store state getters actions storeToRefs 解构 SSR hydration 持久化 服务端数据 URL 状态 局部状态 单一数据源 setup store option store',
  hasCode: true,
};
