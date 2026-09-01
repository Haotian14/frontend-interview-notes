import type { TopicMeta } from '../../../types';

export const meta: TopicMeta = {
  slug: 'code-splitting',
  chapter: 'engineering',
  order: 3,
  title: '代码分割与按需加载',
  summary: '按路由、交互和可见性三条线切分代码，并用预取、加载状态与失败重试避免分割带来的新问题。',
  level: '进阶',
  minutes: 24,
  keywords: ['代码分割', '动态 import', '路由级懒加载', '预取', 'Suspense'],
  prerequisites: ['bundling-tree-shaking'],
  related: ['bundling-tree-shaking', 'module-systems', 'web-vitals', 'react-performance'],
  sources: [
    { label: 'MDN — Dynamic imports', href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import' },
    { label: 'web.dev — Reduce JavaScript payloads with code splitting', href: 'https://web.dev/articles/reduce-javascript-payloads-with-code-splitting' },
  ],
  searchText: '代码分割 code splitting 动态 import 懒加载 lazy loading 路由级分割 React.lazy Suspense 预取 prefetch preload chunk 粒度 加载瀑布 骨架屏 加载失败重试 vendor 分包',
  hasCode: true,
};
