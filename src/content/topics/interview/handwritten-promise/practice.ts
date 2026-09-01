import type { TopicPractice } from '../../../types';

export const practice: TopicPractice = {
  slug: 'handwritten-promise',
  code: {
    input: '实现 MyPromise 后，用一个 500 毫秒后 resolve 的实例连续挂三个 then，并在第二个 then 里抛出异常。',
    output: '第一个 then 的返回值传给第二个，第二个抛出的异常跳过第三个的成功回调直接进入 catch。同时在 resolve 之后再挂 then 仍然会被调用，说明回调队列和"已落定时立即调度"两条路径都实现正确。',
  },
  reference: {
    caption: '实现中的六个关键点',
    rows: [
      { term: '状态不可逆', meaning: 'resolve 与 reject 只在 pending 时生效，之后所有调用忽略。' },
      { term: '回调队列', meaning: 'pending 时把回调存起来，落定时按注册顺序全部执行。' },
      { term: 'then 返回新实例', meaning: '链式的基础；返回自身会导致循环引用。' },
      { term: '异步执行回调', meaning: '用 queueMicrotask 保证回调不在当前同步栈中执行。' },
      { term: '解析过程', meaning: '返回值是 thenable 时要采纳它，且 then 只能被调用一次。' },
      { term: '错误转拒绝', meaning: '回调抛出的异常必须变成下一环的拒绝而不是向外冒泡。' },
    ],
  },
  interview: {
    answer: '我会分四步写。第一步是状态机：三个状态加上值和原因，resolve 和 reject 都先判断是否仍为 pending，不是就直接返回，保证状态只能改变一次。第二步是回调队列：注册 then 时如果还处于 pending，就把成功和失败回调存进数组，等 resolve 或 reject 时按顺序取出执行；如果已经落定，则直接调度执行，这样后挂的 then 也能拿到结果。第三步是 then 返回一个新的 Promise，这是链式的基础，回调的返回值决定新 Promise 的状态：返回普通值就兑现，抛出异常就拒绝，返回 thenable 就要进入解析过程去采纳它。第四步是解析过程，规范要求判断返回值是不是对象或函数并取它的 then，如果是函数就以它为 thenable 调用，同时要加一个只执行一次的标志防止不规范的 thenable 多次回调，还要检查返回值是不是新 Promise 自身，是的话按规范抛 TypeError。另外所有回调都必须异步执行，我用 queueMicrotask 保证时序与原生一致。这道题真正考察的不是背代码，而是能不能解释每一步为什么必须存在，比如为什么 then 必须返回新实例、为什么要防止 thenable 被多次调用。',
    followUps: [
      '为什么 then 必须返回一个新的 Promise？',
      '为什么回调必须异步执行，用宏任务代替微任务会怎样？',
      '解析过程里为什么需要一个只执行一次的标志？',
    ],
  },
};
