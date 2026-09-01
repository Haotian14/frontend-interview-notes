import type { TopicPractice } from '../../../types';

export const practice: TopicPractice = {
  slug: 'abort-race',
  code: {
    input: '在搜索框每次输入时发起请求且不做任何取消，把接口延迟改成随机 100 到 1500 毫秒，快速输入 "a"、"ab"、"abc"。',
    output: '结果区可能最终停留在 "a" 或 "ab" 的结果上，因为先发出的请求后返回并覆盖了新结果。用 AbortController 在每次新请求前取消上一次，或者记录请求序号只接受最新一次的响应，都能消除这个错误。',
  },
  reference: {
    caption: '取消相关 API',
    rows: [
      { term: 'new AbortController()', meaning: '产生一对 controller 与 signal，signal 传给可取消的操作。' },
      { term: 'controller.abort(reason)', meaning: '触发取消；可自定义原因，默认是 AbortError。' },
      { term: 'signal.aborted', meaning: '同步查询是否已取消，用于在 await 之后判断。' },
      { term: 'signal.throwIfAborted()', meaning: '已取消时立刻抛出，适合放在长流程的检查点。' },
      { term: 'AbortSignal.timeout(ms)', meaning: '内置超时信号，无需手写 setTimeout。' },
      { term: 'AbortSignal.any([...])', meaning: '组合多个信号，任一触发即取消。' },
    ],
  },
  interview: {
    answer: '竞态的本质是"响应到达顺序不等于请求发出顺序"，所以只要界面直接用最后到达的响应渲染，就可能显示过期数据。有两类解法。第一类是真正取消：用 AbortController 生成 signal 传给 fetch，发起新请求前先 abort 上一个，被取消的请求会以 AbortError 拒绝，需要在 catch 里识别并忽略它而不是当成错误上报。这一类的好处是同时省掉了带宽和服务端压力，缺点是取消是尽力而为，服务端可能已经执行了副作用，所以写操作要靠幂等键而不是取消。第二类是忽略过期结果：给每次请求分配递增序号或保存最后一次的 token，响应回来后先比对，不是最新的就直接丢弃。React 里两种做法都要放在 effect 的清理函数里，因为组件卸载和依赖变化都会触发。另外 AbortSignal 不只用于 fetch，addEventListener 也接受 signal 选项，可以一次性移除一批监听器，这在做清理时非常方便。',
    followUps: [
      'AbortController 取消请求后，服务端的处理会停止吗？',
      '除了取消，还有哪些方法可以避免过期响应覆盖新结果？',
      '怎么把取消和防抖、重试组合起来？',
    ],
  },
};
