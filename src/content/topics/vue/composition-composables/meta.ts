import type { TopicMeta } from '../../../types';

export const meta: TopicMeta = {
  slug: 'composition-composables',
  chapter: 'vue',
  order: 3,
  title: 'Composition API 与组合式函数',
  summary: '围绕业务能力组织状态和副作用，设计输入明确、可清理、可测试的 composable。',
  level: '高频',
  minutes: 24,
  keywords: ['Composition API', 'composable', '生命周期', 'effectScope', '依赖注入'],
  prerequisites: ['vue-reactivity'],
  related: ['hooks-dependencies', 'pinia-state-architecture', 'abort-race'],
  sources: [
    { label: 'Vue — Composables', href: 'https://vuejs.org/guide/reusability/composables.html' },
    { label: 'Vue — Composition API FAQ', href: 'https://vuejs.org/guide/extras/composition-api-faq.html' },
  ],
  searchText: 'Vue Composition API composable useMouse useFetch setup 生命周期 onMounted onUnmounted effectScope provide inject 状态复用 mixin 冲突 清理 abort controller 测试',
  hasCode: true,
};
