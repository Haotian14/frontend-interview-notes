import type { TopicMeta } from '../../../types';

export const meta: TopicMeta = {
  slug: 'web-storage-cookies',
  chapter: 'browser-network',
  order: 4,
  title: '浏览器存储与 Cookie',
  summary: '按容量、生命周期、是否随请求发送和安全属性来选择存储方案，重点讲清 Cookie 的属性组合。',
  level: '高频',
  minutes: 24,
  keywords: ['Cookie', 'SameSite', 'HttpOnly', 'localStorage', 'IndexedDB'],
  prerequisites: ['cors-cross-origin'],
  related: ['cors-cross-origin', 'csrf-defense', 'xss-defense'],
  sources: [
    { label: 'MDN — Using HTTP cookies', href: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies' },
    { label: 'MDN — Client-side storage', href: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Client-side_APIs/Client-side_storage' },
  ],
  searchText: 'Cookie Set-Cookie HttpOnly Secure SameSite Lax Strict None Domain Path Max-Age Expires localStorage sessionStorage IndexedDB Cache Storage 容量限制 同步阻塞 隐私模式 存储分区 令牌存放位置',
  hasCode: true,
};
