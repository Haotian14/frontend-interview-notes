import type { TopicMeta } from '../../../types';

export const meta: TopicMeta = {
  slug: 'async-await-errors',
  chapter: 'javascript-async',
  order: 3,
  title: 'async/await 与错误处理',
  summary: '把 async 函数看作返回 Promise 的状态机，讲清 await 的暂停恢复语义、串行陷阱和错误边界的划分。',
  level: '高频',
  minutes: 24,
  keywords: ['async', 'await', 'try catch', '串行并发', '错误边界', 'AggregateError'],
  prerequisites: ['promise-semantics'],
  related: ['promise-semantics', 'abort-race', 'error-monitoring'],
  sources: [
    { label: 'MDN — async function', href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function' },
    { label: 'ECMAScript — Async Function Definitions', href: 'https://tc39.es/ecma262/#sec-async-function-definitions' },
  ],
  searchText: 'async await 异步函数 try catch finally 错误处理 串行 并发 for await 顺序执行 Promise.all 返回 Promise 微任务 恢复 栈追踪 错误边界 重新抛出 rethrow',
  hasCode: true,
};
