import type { TopicMeta } from '../../../types';

export const meta: TopicMeta = {
  slug: 'event-loop',
  chapter: 'javascript-async',
  order: 1,
  title: '事件循环与任务队列',
  summary: '从调用栈、任务、微任务和渲染时机解释异步代码的执行顺序。',
  level: '高频',
  minutes: 24,
  keywords: ['调用栈', '任务', '微任务', '渲染'],
  prerequisites: [],
  related: [],
  sources: [
    { label: 'HTML Standard — Event loops', href: 'https://html.spec.whatwg.org/multipage/webappapis.html#event-loops' },
    { label: 'MDN — Microtask guide', href: 'https://developer.mozilla.org/docs/Web/API/HTML_DOM_API/Microtask_guide' },
  ],
  searchText: '调用栈 任务 微任务 Promise 计时器 渲染机会 长任务',
  hasCode: true,
  interview: {
    answer: '事件循环选择并执行一个任务，随后执行微任务检查点；有渲染机会且需要更新时，浏览器会在渲染任务源排入更新渲染任务。',
    followUps: ['为什么微任务会饿死渲染？', 'requestAnimationFrame 在什么时机执行？'],
  },
};
