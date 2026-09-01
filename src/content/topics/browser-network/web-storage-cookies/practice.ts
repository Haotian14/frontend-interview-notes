import type { TopicPractice } from '../../../types';

export const practice: TopicPractice = {
  slug: 'web-storage-cookies',
  code: {
    input: '在控制台读取 `document` 上的 cookie 属性，观察一个带 `HttpOnly` 的会话 Cookie 是否出现；再用 DevTools 的 Application 面板对照。',
    output: 'HttpOnly 的 Cookie 在脚本可读的那份 cookie 字符串里完全不可见，但 Network 面板显示它随请求正常发送。这正是把会话凭证放 Cookie 而不是 localStorage 的核心理由——脚本读不到它，XSS 也就偷不走。',
  },
  reference: {
    caption: '存储方案对照',
    rows: [
      { term: 'Cookie', meaning: '约 4KB，自动随同站请求发送，唯一支持 HttpOnly 的方案。' },
      { term: 'localStorage', meaning: '约 5MB，同步 API 会阻塞主线程，永久保存直到清除。' },
      { term: 'sessionStorage', meaning: '同 API，作用域是单个标签页，关闭即清除。' },
      { term: 'IndexedDB', meaning: '异步、容量大、支持结构化数据与索引，适合离线数据。' },
      { term: 'Cache Storage', meaning: '存放请求与响应对，配合 Service Worker 做离线。' },
      { term: '内存变量', meaning: '刷新即失，最安全，适合访问令牌这类短期凭证。' },
    ],
  },
  interview: {
    answer: '我按四个维度选：容量、生命周期、是否需要随请求自动发送、以及能否被脚本读到。需要服务端每次都看到的凭证只能用 Cookie，因为只有它会自动随请求发送，而且只有它支持 HttpOnly 让脚本读不到。Cookie 的属性组合是关键：HttpOnly 挡住脚本读取从而抵御 XSS 窃取，Secure 要求只在 HTTPS 上发送，SameSite 决定跨站请求带不带它。SameSite 的 Lax 是现代浏览器的默认值，顶级导航的 GET 会带上、跨站的 POST 和子资源请求不会带；Strict 更严但会导致从外站点进来时看起来未登录；None 必须配合 Secure，用于确实需要跨站的场景。另外 Domain 和 Path 决定作用范围，注意 Cookie 不区分端口也不完全区分协议，所以它的隔离粒度比同源策略更粗。存储侧我的默认选择是：不需要服务端看到的偏好设置用 localStorage，标签页级的临时状态用 sessionStorage，大量结构化数据和离线用 IndexedDB，访问令牌尽量放内存加上 HttpOnly 的刷新 Cookie。要强调 localStorage 是同步阻塞的、只能存字符串、在隐私模式或存储受限时可能抛异常，所以读写都要包容错。',
    followUps: [
      '为什么把 JWT 放 localStorage 有风险，正确做法是什么？',
      'SameSite 的三个取值分别在什么场景下选择？',
      'localStorage 和 IndexedDB 各自的适用边界是什么？',
    ],
  },
};
