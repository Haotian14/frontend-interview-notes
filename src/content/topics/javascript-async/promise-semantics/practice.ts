import type { TopicPractice } from '../../../types';

export const practice: TopicPractice = {
  slug: 'promise-semantics',
  code: {
    input: '写三个链：`p.then(v => v + 1)`、`p.then(v => Promise.resolve(v + 1))` 和 `p.then(() => { throw new Error("x") }).catch(e => "recovered")`，分别打印最终值。',
    output: '回调返回普通值时下一个 then 拿到该值；返回 thenable 时链会等待它落定并采纳其结果；抛出异常会让下一个 Promise 变为拒绝，而 catch 的返回值又会让链回到兑现状态。三条规则合起来就是"then 总是返回一个新 Promise"。',
  },
  reference: {
    caption: '四个组合器的语义',
    rows: [
      { term: 'Promise.all', meaning: '全部兑现才兑现，任一拒绝立即拒绝；其余请求不会被取消。' },
      { term: 'Promise.allSettled', meaning: '永不拒绝，返回每一项的 status 与 value/reason。' },
      { term: 'Promise.race', meaning: '第一个落定者决定结果，无论兑现还是拒绝。' },
      { term: 'Promise.any', meaning: '第一个兑现者胜出；全部拒绝时抛 AggregateError。' },
      { term: '错误传播', meaning: '沿链向后找最近的拒绝处理器，中间的 then 成功回调被跳过。' },
      { term: 'finally', meaning: '不接收值、不改变结果，只在返回 Promise 时延迟落定。' },
    ],
  },
  interview: {
    answer: 'Promise 是一个一次性状态机：从 pending 出发，只能转到 fulfilled 或 rejected 一次，之后不可更改，所以它天然解决了回调可能被调用多次或不被调用的问题。then 的关键是它总是返回一个新的 Promise，返回值决定下一环的状态：返回普通值就以该值兑现，返回 thenable 就等待并采纳它的结果，抛出异常就变成拒绝。catch 只是 then(undefined, onRejected) 的简写，它的返回值会让链恢复成兑现，这一点常被忽略。错误沿链向后传播直到遇到最近的拒绝处理器，中间的成功回调被跳过。组合器方面，all 是全成功语义、任一失败立即失败但不会取消其余请求；allSettled 永不拒绝，适合批量上报这种需要全部结果的场景；race 由第一个落定者决定，常用来做超时；any 取第一个成功者，全失败时抛 AggregateError。最后 Promise 回调都在微任务里执行，所以链式调用会在当前宏任务结束前跑完，这决定了它和 setTimeout 的先后顺序。',
    followUps: [
      'then 的回调返回一个 Promise 时会发生什么？',
      'Promise.all 中某一项失败后，其它请求还会继续吗？',
      '未处理的拒绝会怎样，怎么在生产中捕获？',
    ],
  },
};
