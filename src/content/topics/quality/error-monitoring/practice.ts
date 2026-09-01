import type { TopicPractice } from '../../../types';

export const practice: TopicPractice = {
  slug: 'error-monitoring',
  code: {
    input: '在页面上引入一个跨域脚本并让它抛出异常，观察 `window.onerror` 收到的信息；再给 script 标签加上 `crossorigin` 属性并让服务端返回正确的 CORS 头。',
    output: '第一次只能拿到 "Script error." 且没有行号和堆栈，因为浏览器出于安全不暴露跨源脚本细节；加上 crossorigin 并配好响应头后，完整的消息和堆栈才会出现。这是自建监控里最常见的"只有一条无用错误"的原因。',
  },
  reference: {
    caption: '四类必须采集的信号',
    rows: [
      { term: 'JS 运行时异常', meaning: 'window 上的 error 事件，注意跨源脚本需要 crossorigin。' },
      { term: '未处理的 Promise 拒绝', meaning: 'unhandledrejection，异步代码的主要漏点。' },
      { term: '资源加载失败', meaning: '在捕获阶段监听 error，图片、脚本、样式不会冒泡。' },
      { term: '接口失败与慢请求', meaning: '在 fetch 封装层统一采集状态码、耗时与请求 ID。' },
      { term: 'React 渲染异常', meaning: '错误边界捕获渲染期异常，事件与异步回调不在其中。' },
      { term: '上报通道', meaning: 'sendBeacon 或 fetch keepalive，保证页面卸载时不丢。' },
    ],
  },
  interview: {
    answer: '我会先把要采集的信号分成四类，因为它们的捕获方式完全不同。第一类是同步运行时异常，用 window 的 error 事件；这里有个经典坑，跨域脚本抛错时浏览器只给一条 Script error，必须给 script 标签加 crossorigin 并让静态资源返回 CORS 头才能拿到堆栈。第二类是未处理的 Promise 拒绝，用 unhandledrejection，异步代码的漏点几乎都在这里。第三类是资源加载失败，图片和脚本的 error 事件不冒泡，必须在捕获阶段监听。第四类是接口层，在请求封装里统一记录状态码、耗时和请求 ID，这样才能把前端报错和后端日志串起来。React 应用还要加错误边界，但要清楚它只捕获渲染期异常，事件处理器和异步回调不在范围内。采集之后的关键是可用性：上报用 sendBeacon 或 keepalive 避免页面卸载丢数据；生产代码压缩过，必须上传 Source Map 到监控服务而不是部署到线上；同一个错误要按消息加堆栈生成指纹去重，否则一次故障会淹没面板；高流量下做采样，但错误类事件通常全量上报。最后告警要按影响用户数和错误率设阈值并结合发布事件，看到某个版本错误率突增就能快速回滚。',
    followUps: [
      '为什么跨域脚本的错误只有 Script error，怎么解决？',
      '错误边界能捕获哪些错误，不能捕获哪些？',
      '错误上报怎么去噪和去重？',
    ],
  },
};
