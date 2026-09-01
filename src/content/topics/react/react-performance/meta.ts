import type { TopicMeta } from '../../../types';

export const meta: TopicMeta = {
  slug: 'react-performance',
  chapter: 'react',
  order: 4,
  title: 'React 性能优化',
  summary: '先用 Profiler 找到真正的瓶颈，再按结构调整、记忆化、虚拟化、并发特性的顺序选择手段。',
  level: '进阶',
  minutes: 26,
  keywords: ['React.memo', 'useMemo', 'useCallback', '虚拟滚动', 'useTransition', 'Profiler'],
  prerequisites: ['reconciliation-keys'],
  related: ['reconciliation-keys', 'hooks-dependencies', 'state-architecture', 'web-vitals'],
  sources: [
    { label: 'React — useMemo', href: 'https://react.dev/reference/react/useMemo' },
    { label: 'React — useTransition', href: 'https://react.dev/reference/react/useTransition' },
  ],
  searchText: 'React 性能优化 React.memo useMemo useCallback 记忆化 浅比较 引用相等 重渲染 虚拟滚动 windowing useTransition useDeferredValue 并发 Profiler 火焰图 状态下移 内容提升 children',
  hasCode: true,
};
