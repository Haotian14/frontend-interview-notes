import type { TopicMeta } from '../../../types';

export const meta: TopicMeta = {
  slug: 'module-systems',
  chapter: 'javascript-core',
  order: 5,
  title: '模块系统与 ESM',
  summary: '对比 ESM 与 CommonJS 的解析时机、绑定语义和循环依赖表现，解释它们如何影响打包与 Tree Shaking。',
  level: '进阶',
  minutes: 24,
  keywords: ['ESM', 'CommonJS', '静态分析', '循环依赖', '动态 import', '实时绑定'],
  prerequisites: ['closures-scope'],
  related: ['closures-scope', 'bundling-tree-shaking'],
  sources: [
    { label: 'MDN — JavaScript modules', href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules' },
    { label: 'ECMAScript — Modules', href: 'https://tc39.es/ecma262/#sec-modules' },
  ],
  searchText: 'ESM ES Module CommonJS require module.exports import export 静态分析 实时绑定 live binding 循环依赖 顶层 await 动态 import 副作用 sideEffects Tree Shaking 双包危险 dual package hazard exports 字段',
  hasCode: true,
};
