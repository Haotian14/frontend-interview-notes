import type { TopicMeta } from '../../../types';

export const meta: TopicMeta = {
  slug: 'closures-scope',
  chapter: 'javascript-core',
  order: 1,
  title: '作用域链与闭包',
  summary: '从词法环境、标识符解析和变量生命周期解释闭包为什么能保留状态，以及它的真实内存代价。',
  level: '高频',
  minutes: 26,
  keywords: ['词法作用域', '闭包', '环境记录', 'TDZ', '变量生命周期'],
  prerequisites: [],
  related: ['event-loop', 'render-state-snapshot'],
  sources: [
    { label: 'ECMA-262 — Execution Contexts', href: 'https://tc39.es/ecma262/#sec-execution-contexts' },
    { label: 'MDN — Closures', href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures' },
  ],
  searchText: '作用域 scope 词法作用域 lexical scope 闭包 closure 环境记录 environment record 作用域链 scope chain 变量提升 hoisting 暂时性死区 TDZ var let const 循环闭包 IIFE 私有状态 内存泄漏',
  hasCode: true,
};
