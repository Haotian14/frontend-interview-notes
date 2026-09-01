import type { TopicMeta } from '../../../types';

export const meta: TopicMeta = {
  slug: 'this-binding',
  chapter: 'javascript-core',
  order: 2,
  title: 'this 绑定与调用点',
  summary: '把 this 归结为调用点决定的四条规则，并解释箭头函数、class 字段与严格模式如何改变结论。',
  level: '高频',
  minutes: 22,
  keywords: ['this', '调用点', 'call apply bind', '箭头函数', '严格模式'],
  prerequisites: ['closures-scope'],
  related: ['closures-scope', 'prototype-inheritance'],
  sources: [
    { label: 'MDN — this', href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this' },
    { label: 'ECMAScript — Function Calls', href: 'https://tc39.es/ecma262/#sec-function-calls' },
  ],
  searchText: 'this 绑定 调用点 call site 默认绑定 隐式绑定 显式绑定 call apply bind new 绑定 箭头函数 词法 this 严格模式 undefined 全局对象 class 字段 事件处理器 currentTarget 丢失 this',
  hasCode: true,
};
