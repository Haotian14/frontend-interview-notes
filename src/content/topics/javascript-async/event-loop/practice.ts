import type { TopicPractice } from '../../../types';

export const practice: TopicPractice = {
  slug: 'event-loop',
  code: {
    input: '在同一段同步代码里依次排入 `setTimeout(fn, 0)`、`Promise.resolve().then(fn)` 和一条同步 `console.log`。',
    output: '输出顺序是同步语句 → 微任务 → 宏任务。再让微任务里递归排入新的微任务，会看到渲染被饿死、页面在这段时间内完全不更新。',
  },
  reference: {
    caption: '任务与微任务速查',
    rows: [
      { term: '宏任务（任务源）', meaning: '计时器、事件、网络回调；每轮只取一个。' },
      { term: '微任务检查点', meaning: '当前任务结束后清空整个微任务队列。' },
      { term: 'queueMicrotask', meaning: '显式排入微任务，与 Promise 回调同队列。' },
      { term: 'requestAnimationFrame', meaning: '在渲染机会到来、样式计算之前执行。' },
    ],
  },
  interview: {
    answer: '事件循环选择并执行一个任务，随后执行微任务检查点；有渲染机会且需要更新时，浏览器会在渲染任务源排入更新渲染任务。',
    followUps: ['为什么微任务会饿死渲染？', 'requestAnimationFrame 在什么时机执行？'],
  },
};
