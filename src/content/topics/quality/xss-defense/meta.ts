import type { TopicMeta } from '../../../types';

export const meta: TopicMeta = {
  slug: 'xss-defense',
  chapter: 'quality',
  order: 1,
  title: 'XSS 防御与内容安全策略',
  summary: '按注入上下文选择编码方式，用框架默认转义、可信输入校验和 CSP 建立分层防御。',
  level: '高频',
  minutes: 26,
  keywords: ['XSS', '输出编码', 'CSP', 'DOM 注入', 'nonce'],
  prerequisites: ['semantic-accessibility'],
  related: ['semantic-accessibility', 'type-narrowing'],
  sources: [
    { label: 'OWASP — Cross Site Scripting Prevention Cheat Sheet', href: 'https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html' },
    { label: 'MDN — Content Security Policy', href: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP' },
  ],
  searchText: 'XSS 跨站脚本 cross site scripting 存储型 反射型 DOM 型 输出编码 output encoding 转义 escaping innerHTML dangerouslySetInnerHTML sanitize 净化 DOMPurify CSP 内容安全策略 nonce hash script-src unsafe-inline Trusted Types HttpOnly SameSite',
  hasCode: true,
};
