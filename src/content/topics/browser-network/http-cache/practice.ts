import type { TopicPractice } from '../../../types';

export const practice: TopicPractice = {
  slug: 'http-cache',
  reference: {
    caption: 'HTTP 缓存指令速查',
    rows: [
      { term: 'max-age', meaning: '定义响应的新鲜时间。' },
      { term: 'no-cache', meaning: '允许存储，但复用前必须验证。' },
      { term: 'no-store', meaning: '禁止存储响应。' },
      { term: 'immutable', meaning: '新鲜期内即使用户刷新也不发条件请求。' },
      { term: 'ETag / If-None-Match', meaning: '内容验证器；未变化时返回 304。' },
    ],
  },
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
