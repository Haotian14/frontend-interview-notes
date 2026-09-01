import type { TopicMeta } from '../../../types';

export const meta: TopicMeta = {
  slug: 'bundling-tree-shaking',
  chapter: 'engineering',
  order: 2,
  title: '打包、Tree Shaking 与产物',
  summary: '解释打包器的依赖图与产物构成，讲清 Tree Shaking 生效的条件、副作用声明与产物分析方法。',
  level: '进阶',
  minutes: 24,
  keywords: ['打包', 'Tree Shaking', 'sideEffects', '产物分析', '构建工具'],
  prerequisites: ['module-systems'],
  related: ['module-systems', 'code-splitting', 'ci-quality-gates'],
  sources: [
    { label: 'MDN — Tree shaking', href: 'https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking' },
    { label: 'Vite — Building for Production', href: 'https://vite.dev/guide/build.html' },
  ],
  searchText: '打包 bundler 依赖图 Tree Shaking 摇树 sideEffects 副作用 死代码消除 dead code elimination 产物分析 bundle 体积 可视化 压缩 minify 作用域提升 scope hoisting 开发构建 生产构建 esbuild rollup',
  hasCode: true,
};
