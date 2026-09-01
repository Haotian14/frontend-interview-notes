import type { TopicPractice } from '../../../types';

export const practice: TopicPractice = {
  slug: 'csrf-defense',
  code: {
    input: '在一个与目标站点不同源的页面上放一个自动提交的表单，`action` 指向目标站点的转账接口，method 为 POST。',
    output: '如果目标站点的会话 Cookie 没有设置 SameSite 且接口没有校验令牌，请求会带着用户的登录状态被执行——攻击者读不到响应，但副作用已经发生。把 Cookie 改成 SameSite=Lax 后表单提交不再携带凭证，请求被当作未登录处理。',
  },
  reference: {
    caption: '三层防御的分工',
    rows: [
      { term: 'SameSite Cookie', meaning: '第一道防线，让跨站请求根本不带凭证；Lax 已是现代默认。' },
      { term: 'CSRF token', meaning: '服务端下发、请求回传的一次性令牌，攻击者无法读取。' },
      { term: '双提交 Cookie', meaning: '无状态变体：令牌同时放 Cookie 与请求体，服务端比对。' },
      { term: 'Origin / Referer 校验', meaning: '服务端检查请求来源，实现简单但需处理缺失情况。' },
      { term: '自定义请求头', meaning: '跨站无法用简单请求携带自定义头，会触发预检从而被拦。' },
      { term: '语义正确的方法', meaning: 'GET 不产生副作用，让最容易被伪造的请求无害。' },
    ],
  },
  interview: {
    answer: 'CSRF 的前提是浏览器会自动为同站请求带上 Cookie，而同源策略只限制读取不限制发送。所以攻击者在自己的页面上构造一个指向目标站点的表单或图片请求，用户的登录凭证就会被自动带上，请求被当作合法操作执行；攻击者读不到响应，但转账、改密码这类副作用已经发生。防御分三层。第一层是 SameSite Cookie，Lax 已经是现代浏览器的默认值，跨站的 POST 和子资源请求不会带上凭证，这一层挡掉了绝大多数经典 CSRF；但它依赖浏览器版本，也不覆盖同站不同子域的场景，所以不能作为唯一防线。第二层是 CSRF token，服务端下发一个与会话绑定的随机值，前端在提交时放进请求头或请求体，服务端比对；关键在于攻击者虽然能让浏览器发请求，却读不到页面内容也读不到这个令牌。无状态服务可以用双提交模式，把令牌同时放进 Cookie 和请求体做比对。第三层是服务端校验 Origin 或 Referer，实现简单但要处理头部缺失的情况。另外还有两条基本纪律：GET 绝不产生副作用，以及给敏感操作加二次确认。最后要注意 CSRF 防御在存在 XSS 时全部失效，因为注入的脚本可以读到令牌。',
    followUps: [
      '为什么 SameSite=Lax 不能作为唯一的 CSRF 防御？',
      'CSRF token 为什么攻击者拿不到？双提交模式的原理是什么？',
      '为什么说有 XSS 就没有 CSRF 防御？',
    ],
  },
};
