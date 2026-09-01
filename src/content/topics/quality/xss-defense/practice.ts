import type { TopicPractice } from '../../../types';

export const practice: TopicPractice = {
  slug: 'xss-defense',
  code: {
    input: '把 `javascript:alert(1)` 作为用户提供的链接地址渲染成 `<a href={userInput}>`，再把同一段输入交给只允许 `http/https` 协议的校验函数。',
    output: '第一种写法在框架自动转义之下依然可执行——转义针对的是 HTML 文本上下文，不是 URL 协议；加上协议白名单后链接被拒绝或降级为纯文本。',
  },
  reference: {
    caption: '注入上下文与对应处理',
    rows: [
      { term: 'HTML 文本', meaning: '转义 < > & 等字符；框架默认插值已覆盖。' },
      { term: 'HTML 属性', meaning: '需引号包裹并转义引号；事件处理属性不接受不可信输入。' },
      { term: 'URL', meaning: '校验协议白名单；javascript: 与 data: 需拒绝。' },
      { term: 'JavaScript / CSS', meaning: '不要把不可信数据拼进代码上下文，改用数据通道传递。' },
    ],
  },
  interview: {
    answer: 'XSS 的本质是不可信数据越过了数据边界、被浏览器当成代码解析，按注入位置分为存储型、反射型和 DOM 型。防御的第一原则是按输出上下文选择编码：HTML 文本转义尖括号和 & ，属性要在引号内转义，URL 要做协议白名单拒绝 javascript: 和 data:，而 JavaScript 与 CSS 上下文根本不应拼接不可信数据。React、Vue 的默认插值已经覆盖 HTML 文本上下文，真正的风险集中在绕过它的出口——innerHTML、dangerouslySetInnerHTML、href/src 和动态生成的脚本；确实需要渲染富文本时要用 DOMPurify 这类成熟净化库并保持更新。最后用 CSP 作为第二层：以 nonce 或 hash 授权脚本、避免 unsafe-inline，配合 Trusted Types 收紧 DOM 注入点，让单个疏漏不至于直接变成可执行漏洞。',
    followUps: [
      '为什么"统一转义所有输入"不是正确的防御策略？',
      'DOM 型 XSS 与反射型 XSS 在防御位置上有什么区别？',
      'CSP 为什么不能替代输出编码？',
      'HttpOnly Cookie 能防住 XSS 吗？',
    ],
  },
};
