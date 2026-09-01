import type { TopicMeta } from '../../../types';

export const meta: TopicMeta = {
  slug: 'concurrency-pool',
  chapter: 'interview',
  order: 5,
  title: '手写 Promise 并发池',
  summary: '用固定数量 worker 消费任务，保持结果顺序，并补齐失败策略、取消和动态任务等工程边界。',
  level: '高频',
  minutes: 24,
  keywords: ['并发池', 'Promise', '限流', '任务队列', '手写题'],
  prerequisites: ['promise-semantics'],
  related: ['abort-race', 'async-await-errors', 'virtual-list'],
  sources: [
    { label: 'MDN — Promise.all', href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all' },
    { label: 'MDN — AbortController', href: 'https://developer.mozilla.org/en-US/docs/Web/API/AbortController' },
  ],
  searchText: 'Promise 并发池 concurrency pool limit worker queue 批量请求 上传 限流 结果顺序 fail fast allSettled AbortController 动态任务 重试 手写题',
  hasCode: true,
};
