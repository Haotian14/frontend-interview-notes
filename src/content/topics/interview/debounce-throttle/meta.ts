import type { TopicMeta } from '../../../types';

export const meta: TopicMeta = {
  slug: 'debounce-throttle',
  chapter: 'interview',
  order: 1,
  title: '防抖与节流的实现与取舍',
  summary: '从"等安静"与"限频率"两种语义出发写出可取消、可回收的实现，并说明它们各自的适用边界。',
  level: '高频',
  minutes: 24,
  keywords: ['防抖', '节流', '手写题', '定时器', '取消'],
  prerequisites: ['event-loop'],
  related: ['event-loop', 'closures-scope'],
  sources: [
    { label: 'MDN — setTimeout', href: 'https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout' },
    { label: 'MDN — requestAnimationFrame', href: 'https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame' },
  ],
  searchText: '防抖 debounce 节流 throttle 手写题 实现 定时器 setTimeout 取消 cancel flush leading trailing 前沿 后沿 requestAnimationFrame 滚动 输入联想 resize 高频事件',
  hasCode: true,
};
