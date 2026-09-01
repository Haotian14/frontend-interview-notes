import type { TopicMeta } from '../../../types';

export const meta: TopicMeta = {
  slug: 'web-vitals',
  chapter: 'quality',
  order: 2,
  title: 'Core Web Vitals 与性能测量',
  summary: '讲清 LCP、INP、CLS 的定义与常见成因，区分实验室数据与真实用户数据，并给出可执行的优化顺序。',
  level: '高频',
  minutes: 26,
  keywords: ['LCP', 'INP', 'CLS', 'RUM', 'PerformanceObserver'],
  prerequisites: ['rendering-pipeline'],
  related: ['rendering-pipeline', 'responsive-images', 'code-splitting', 'error-monitoring'],
  sources: [
    { label: 'web.dev — Core Web Vitals', href: 'https://web.dev/articles/vitals' },
    { label: 'MDN — Performance API', href: 'https://developer.mozilla.org/en-US/docs/Web/API/Performance_API' },
  ],
  searchText: 'Core Web Vitals LCP 最大内容绘制 INP 交互到下次绘制 CLS 累积布局偏移 TTFB FCP 长任务 long task PerformanceObserver RUM 真实用户监控 实验室数据 lab field 75 分位 Lighthouse 性能预算',
  hasCode: true,
};
