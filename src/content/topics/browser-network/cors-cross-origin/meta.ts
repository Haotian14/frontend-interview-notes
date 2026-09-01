import type { TopicMeta } from '../../../types';

export const meta: TopicMeta = {
  slug: 'cors-cross-origin',
  chapter: 'browser-network',
  order: 3,
  title: '同源策略与 CORS',
  summary: '从同源策略的目的出发解释 CORS 的请求流程、预检条件和凭据规则，并区分它与服务端鉴权的边界。',
  level: '高频',
  minutes: 26,
  keywords: ['同源策略', 'CORS', '预检请求', 'credentials', 'Access-Control-Allow-Origin'],
  prerequisites: ['http-cache'],
  related: ['http-cache', 'web-storage-cookies', 'csrf-defense'],
  sources: [
    { label: 'MDN — Cross-Origin Resource Sharing (CORS)', href: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS' },
    { label: 'Fetch Standard — CORS protocol', href: 'https://fetch.spec.whatwg.org/#http-cors-protocol' },
  ],
  searchText: '同源策略 same-origin policy 源 origin 协议 域名 端口 CORS 跨域 简单请求 预检 preflight OPTIONS Access-Control-Allow-Origin Allow-Credentials Allow-Headers Max-Age credentials include 通配符 Vary Origin 代理 网关',
  hasCode: true,
};
