import type { TopicMeta } from '../../../types';

export const meta: TopicMeta = {
  slug: 'hooks-dependencies',
  chapter: 'react',
  order: 2,
  title: 'Hooks 规则与依赖数组',
  summary: '解释 Hooks 顺序规则的由来，讲清 effect 依赖数组的正确读法，以及大多数 effect 其实不该存在。',
  level: '高频',
  minutes: 26,
  keywords: ['useEffect', '依赖数组', 'Hooks 规则', 'useRef', '闭包陷阱'],
  prerequisites: ['render-state-snapshot'],
  related: ['render-state-snapshot', 'react-performance', 'closures-scope'],
  sources: [
    { label: 'React — Synchronizing with Effects', href: 'https://react.dev/learn/synchronizing-with-effects' },
    { label: 'React — You Might Not Need an Effect', href: 'https://react.dev/learn/you-might-not-need-an-effect' },
  ],
  searchText: 'useEffect 依赖数组 dependency array Hooks 规则 顺序 条件调用 闭包陷阱 stale closure 清理函数 cleanup useRef useLayoutEffect 派生状态 derived state useMemo 同步外部系统 useSyncExternalStore StrictMode 双调用',
  hasCode: true,
};
