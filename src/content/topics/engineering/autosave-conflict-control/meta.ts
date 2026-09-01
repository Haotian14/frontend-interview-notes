import type { TopicMeta } from '../../../types';

export const meta: TopicMeta = {
  slug: 'autosave-conflict-control',
  chapter: 'engineering',
  order: 6,
  title: '自动保存、队列与冲突控制',
  summary: '把高频编辑归并成有序操作，使用版本条件、重试与本地恢复保证最终保存的是用户最新意图。',
  level: '进阶',
  minutes: 26,
  keywords: ['自动保存', '队列', '版本控制', '冲突', '离线恢复'],
  prerequisites: ['async-await-errors', 'abort-race'],
  related: ['infinite-canvas-architecture', 'http-cache', 'ci-quality-gates'],
  sources: [
    { label: 'MDN — ETag', href: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/ETag' },
    { label: 'MDN — IndexedDB API', href: 'https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API' },
  ],
  searchText: '自动保存 autosave debounce queue serial revision version ETag If-Match optimistic concurrency conflict 409 412 idempotency retry backoff offline IndexedDB dirty state flush beforeunload save latest intent',
  hasCode: true,
};
