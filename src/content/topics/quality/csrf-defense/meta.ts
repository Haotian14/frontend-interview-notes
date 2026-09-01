import type { TopicMeta } from '../../../types';

export const meta: TopicMeta = {
  slug: 'csrf-defense',
  chapter: 'quality',
  order: 3,
  title: 'CSRF 与身份凭证',
  summary: '从"浏览器自动携带凭证"这一前提解释 CSRF 的成因，比较 SameSite、CSRF token 与源校验三层防御。',
  level: '高频',
  minutes: 24,
  keywords: ['CSRF', 'SameSite', 'CSRF token', '双提交', '源校验'],
  prerequisites: ['web-storage-cookies'],
  related: ['web-storage-cookies', 'cors-cross-origin', 'xss-defense'],
  sources: [
    { label: 'OWASP — Cross-Site Request Forgery Prevention Cheat Sheet', href: 'https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html' },
    { label: 'MDN — SameSite cookies', href: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie/SameSite' },
  ],
  searchText: 'CSRF 跨站请求伪造 SameSite Lax Strict CSRF token 同步器令牌 双提交 Cookie double submit 源校验 Origin Referer 自定义请求头 幂等 安全方法 GET 副作用 登录 CSRF',
  hasCode: true,
};
