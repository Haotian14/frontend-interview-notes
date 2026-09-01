import type { TopicMeta } from '../../../types';

export const meta: TopicMeta = {
  slug: 'virtual-list',
  chapter: 'interview',
  order: 6,
  title: '虚拟列表的实现与性能边界',
  summary: '把滚动偏移映射为可见索引，只渲染视口附近元素，并处理动态高度、锚点稳定和可访问性。',
  level: '进阶',
  minutes: 26,
  keywords: ['虚拟列表', '窗口化', '动态高度', '滚动性能', '手写题'],
  prerequisites: ['rendering-pipeline'],
  related: ['infinite-canvas-architecture', 'react-performance', 'web-vitals'],
  sources: [
    { label: 'web.dev — Virtualize large lists', href: 'https://web.dev/articles/virtualize-long-lists-react-window' },
    { label: 'MDN — ResizeObserver', href: 'https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver' },
  ],
  searchText: '虚拟列表 virtual list windowing fixed height dynamic height overscan scrollTop startIndex endIndex spacer translateY ResizeObserver prefix sum binary search scroll anchoring infinite loading accessibility',
  hasCode: true,
};
