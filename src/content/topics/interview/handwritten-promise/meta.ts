import type { TopicMeta } from '../../../types';

export const meta: TopicMeta = {
  slug: 'handwritten-promise',
  chapter: 'interview',
  order: 2,
  title: '手写 Promise',
  summary: '按状态机、回调队列、then 链和解析过程四步实现一个符合规范的 Promise，并说明每一步为什么必须这样写。',
  level: '进阶',
  minutes: 28,
  keywords: ['手写 Promise', 'Promises/A+', '微任务', 'then 链', 'thenable'],
  prerequisites: ['promise-semantics'],
  related: ['promise-semantics', 'event-loop', 'async-await-errors'],
  sources: [
    { label: 'Promises/A+ 规范', href: 'https://promisesaplus.com/' },
    { label: 'ECMAScript — Promise Objects', href: 'https://tc39.es/ecma262/#sec-promise-objects' },
  ],
  searchText: '手写 Promise 实现 Promises/A+ 状态机 pending fulfilled rejected 回调队列 then 链 返回新 Promise resolvePromise thenable 采纳 微任务 queueMicrotask 循环引用 TypeError all race allSettled 实现',
  hasCode: true,
};
