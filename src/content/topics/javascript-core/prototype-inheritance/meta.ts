import type { TopicMeta } from '../../../types';

export const meta: TopicMeta = {
  slug: 'prototype-inheritance',
  chapter: 'javascript-core',
  order: 3,
  title: '原型链与继承',
  summary: '区分 __proto__ 与 prototype，讲清属性查找、new 的四个步骤，以及 class 语法糖背后的原型关系。',
  level: '高频',
  minutes: 26,
  keywords: ['原型链', 'prototype', 'new', 'class', 'instanceof', 'Object.create'],
  prerequisites: ['this-binding'],
  related: ['this-binding', 'type-coercion'],
  sources: [
    { label: 'MDN — Inheritance and the prototype chain', href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain' },
    { label: 'ECMAScript — Ordinary Object Internal Methods', href: 'https://tc39.es/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots' },
  ],
  searchText: '原型链 prototype __proto__ getPrototypeOf setPrototypeOf new 操作符 构造函数 class extends super instanceof hasOwnProperty Object.create 属性查找 屏蔽 shadowing 原型污染',
  hasCode: true,
};
