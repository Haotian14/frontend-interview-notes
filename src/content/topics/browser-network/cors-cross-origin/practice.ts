import type { TopicPractice } from '../../../types';

export const practice: TopicPractice = {
  slug: 'cors-cross-origin',
  code: {
    input: '用 `fetch` 向另一个源发一个带 `Content-Type: application/json` 的 POST，在 Network 面板里观察请求数量。',
    output: '会先出现一个 OPTIONS 预检请求，因为 application/json 不在简单请求允许的三种 Content-Type 里；服务端必须对 OPTIONS 返回允许的方法与头部，真正的 POST 才会发出。把 Content-Type 换成 text/plain 后预检消失，说明预检由请求的方法、头部和内容类型共同决定。',
  },
  reference: {
    caption: 'CORS 关键响应头',
    rows: [
      { term: 'Access-Control-Allow-Origin', meaning: '允许的源；带凭据时不能用通配符，必须回显具体源。' },
      { term: 'Access-Control-Allow-Credentials', meaning: '为 true 时浏览器才会带上并接受 Cookie。' },
      { term: 'Access-Control-Allow-Methods / Headers', meaning: '预检响应中声明允许的方法与自定义头。' },
      { term: 'Access-Control-Max-Age', meaning: '预检结果的缓存时间，减少 OPTIONS 次数。' },
      { term: 'Access-Control-Expose-Headers', meaning: '默认只能读到七个响应头，其余需要显式暴露。' },
      { term: 'Vary: Origin', meaning: '按源动态返回时必须加，否则中间缓存会串源。' },
    ],
  },
  interview: {
    answer: '同源策略是浏览器的基础隔离机制，源由协议、主机和端口三者共同决定，任意一项不同就是跨源。它限制的是读取而不是发送，比如跨源的表单提交和图片加载一直是允许的，但脚本读不到响应内容，这个区别正是 CSRF 存在的原因。CORS 是服务端用响应头来放宽这个限制的协议。请求分两类：方法为 GET、HEAD、POST 且只带若干安全头、Content-Type 限于三种表单或纯文本类型时属于简单请求，直接发出后由浏览器检查响应头决定是否交给脚本；否则浏览器先发一个 OPTIONS 预检，带上要用的方法和自定义头，服务端同意后才发真正的请求。带凭据时规则更严：请求要设置 credentials 为 include，响应必须同时有 Allow-Credentials 为 true 和具体的 Allow-Origin，不能用星号。还有两点常被忽略：跨源响应默认只能读到七个基础头部，其它要用 Expose-Headers 暴露；按 Origin 动态返回时必须加 Vary: Origin，否则 CDN 会把一个源的响应给另一个源。最后要强调 CORS 是浏览器侧的保护，不是鉴权，服务端仍然必须自己校验身份和权限。',
    followUps: [
      '哪些请求会触发预检，怎么减少预检次数？',
      '带 Cookie 的跨源请求有哪些额外要求？',
      'CORS 能替代服务端鉴权吗？',
    ],
  },
};
