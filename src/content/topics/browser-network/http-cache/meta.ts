import type { TopicMeta } from '../../../types';

export const meta: TopicMeta = {
  slug: 'http-cache',
  chapter: 'browser-network',
  order: 2,
  title: 'HTTP 缓存与重新验证',
  summary: '用新鲜度、验证器和部署策略区分本地缓存命中、条件请求与禁止存储。',
  level: '高频',
  minutes: 26,
  keywords: ['Cache-Control', 'ETag', '新鲜度', '304'],
  prerequisites: ['rendering-pipeline'],
  related: ['rendering-pipeline'],
  sources: [
    { label: 'RFC 9111 — HTTP Caching', href: 'https://www.rfc-editor.org/rfc/rfc9111' },
    { label: 'MDN — HTTP caching', href: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching' },
  ],
  searchText: 'HTTP cache 缓存 freshness 新鲜度 validators 验证器 Cache-Control max-age ETag If-None-Match Last-Modified If-Modified-Since 304 memory cache disk cache private public no-cache no-store immutable',
  hasCode: false,
};
