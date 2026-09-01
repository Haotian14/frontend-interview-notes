import type { TopicMeta } from '../../../types';

export const meta: TopicMeta = {
  slug: 'deep-clone',
  chapter: 'interview',
  order: 3,
  title: '深拷贝的实现与边界',
  summary: '从 JSON 往返的失败案例出发，实现支持循环引用与特殊类型的深拷贝，并说明何时应该用 structuredClone。',
  level: '高频',
  minutes: 24,
  keywords: ['深拷贝', '循环引用', 'structuredClone', 'WeakMap', '不可变数据'],
  prerequisites: ['type-coercion'],
  related: ['type-coercion', 'prototype-inheritance', 'render-state-snapshot'],
  sources: [
    { label: 'MDN — structuredClone()', href: 'https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone' },
    { label: 'HTML Standard — Structured cloning', href: 'https://html.spec.whatwg.org/multipage/structured-data.html#safe-passing-of-structured-data' },
  ],
  searchText: '深拷贝 deep clone 浅拷贝 JSON.parse stringify 循环引用 WeakMap structuredClone 结构化克隆 Date Map Set RegExp 函数 Symbol 原型 不可变 immutable 展开运算符 引用相等',
  hasCode: true,
};
