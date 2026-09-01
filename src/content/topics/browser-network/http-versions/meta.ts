import type { TopicMeta } from '../../../types';

export const meta: TopicMeta = {
  slug: 'http-versions',
  chapter: 'browser-network',
  order: 5,
  title: 'HTTP 版本演进与连接',
  summary: '沿着队头阻塞这条主线理解 HTTP/1.1、HTTP/2 与 HTTP/3 的差异，并据此调整前端的资源加载策略。',
  level: '进阶',
  minutes: 26,
  keywords: ['HTTP/2', 'HTTP/3', 'QUIC', '队头阻塞', '多路复用', 'TLS 握手'],
  prerequisites: ['http-cache'],
  related: ['http-cache', 'rendering-pipeline', 'web-vitals'],
  sources: [
    { label: 'MDN — Evolution of HTTP', href: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Evolution_of_HTTP' },
    { label: 'RFC 9114 — HTTP/3', href: 'https://www.rfc-editor.org/rfc/rfc9114.html' },
  ],
  searchText: 'HTTP/1.1 HTTP/2 HTTP/3 QUIC 队头阻塞 head-of-line blocking 多路复用 二进制分帧 HPACK QPACK 头部压缩 服务端推送 域名分片 雪碧图 连接复用 TLS 握手 0-RTT 优先级 早期提示 Early Hints',
  hasCode: true,
};
