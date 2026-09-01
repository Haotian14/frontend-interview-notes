import type { TopicMeta } from '../../../types';

export const meta: TopicMeta = {
  slug: 'promise-semantics',
  chapter: 'javascript-async',
  order: 2,
  title: 'Promise 状态机与组合',
  summary: '把 Promise 理解为一次性状态机加链式转换，讲清 then 的返回值规则和四个组合器的取舍。',
  level: '高频',
  minutes: 26,
  keywords: ['Promise', 'then', 'all', 'allSettled', 'race', '微任务'],
  prerequisites: ['event-loop'],
  related: ['event-loop', 'async-await-errors', 'handwritten-promise'],
  sources: [
    { label: 'MDN — Using promises', href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises' },
    { label: 'ECMAScript — Promise Objects', href: 'https://tc39.es/ecma262/#sec-promise-objects' },
  ],
  searchText: 'Promise 状态机 pending fulfilled rejected settled then catch finally 链式 返回值 thenable Promise.all allSettled race any 并发 微任务 unhandledrejection 吞掉异常',
  hasCode: true,
};
