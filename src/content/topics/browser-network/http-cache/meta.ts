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
  interview: {
    answer: 'HTTP 缓存先判断响应能否存储，再依据 Cache-Control 等信息计算新鲜度。仍新鲜的副本可直接从内存或磁盘复用，不发网络请求；过期副本若有 ETag 或 Last-Modified，则发送条件请求，未变化时服务器返回 304，客户端继续使用已有响应体。no-cache 表示可以存但复用前必须验证，no-store 才是不要存储。部署时让 HTML 使用短缓存或每次验证，确保能发现新入口；带内容哈希的静态资源使用长 max-age 与 immutable，内容变化就换 URL。',
    followUps: [
      '200 from memory cache 与 304 的网络成本有什么区别？',
      'no-cache 和 no-store 为什么不能混为一谈？',
      'ETag 与 Last-Modified 同时存在时如何验证？',
      '为什么 HTML 和带哈希静态资源要采用不同缓存策略？',
    ],
  },
};
