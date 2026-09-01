import type { TopicPractice } from '../../../types';

export const practice: TopicPractice = {
  slug: 'async-await-errors',
  code: {
    input: '写两段代码：一段在循环里 `await fetchOne(id)`，一段先 `map` 出所有 Promise 再 `await Promise.all(...)`，对同一批 10 个请求计时。',
    output: '第一段的总耗时约等于各请求耗时之和，第二段约等于最慢的那个。差别不在 await 本身，而在于请求是在循环里被逐个创建的——await 只是等待，真正决定并发的是何时调用产生 Promise 的函数。',
  },
  reference: {
    caption: '几种写法的语义对照',
    rows: [
      { term: 'await a(); await b();', meaning: '串行：b 在 a 完成后才开始。' },
      { term: 'const pa = a(), pb = b(); await pa; await pb;', meaning: '并发启动，顺序等待。' },
      { term: 'await Promise.all([a(), b()])', meaning: '并发启动，任一失败立即抛出。' },
      { term: 'return await p（在 try 内）', meaning: '必要写法：省略 await 会让 catch 接不到拒绝。' },
      { term: 'for await (const x of stream)', meaning: '按序消费异步迭代器，天然串行。' },
      { term: 'try/finally', meaning: '无论成功失败都执行清理；不要在 finally 里 return。' },
    ],
  },
  interview: {
    answer: 'async 函数总是返回 Promise：正常返回值会被包装成兑现，抛出的异常会变成拒绝，所以它和 Promise 是同一套语义的两种语法。await 会把函数暂停在当前位置，把后续代码注册成微任务，等待的值落定后再恢复执行，因此 await 之后的代码本质上是回调，只是写起来像同步。错误处理上，await 让拒绝变成可以被 try/catch 捕获的异常，这是它最大的价值；但有两个坑：一是 try 块里直接 return 一个 Promise 而不加 await，函数会在 Promise 落定前就返回，catch 和 finally 都失效；二是循环里逐个 await 会把并发变成串行，因为产生 Promise 的调用本身被推迟了，正确写法是先创建所有 Promise 再用 Promise.all 等待。我的错误处理原则是分层：底层只负责把技术错误转成带上下文的领域错误并重新抛出，中间层决定重试或降级，最上层统一展示与上报，不要在每个函数里都写一个 try/catch 然后吞掉异常。',
    followUps: [
      '为什么循环里 await 会导致串行，怎么改成并发？',
      'try 块中 return await p 和 return p 有什么区别？',
      'async 函数抛出的异常和同步异常在栈追踪上有什么差别？',
    ],
  },
};
