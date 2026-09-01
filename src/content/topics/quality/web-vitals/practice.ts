import type { TopicPractice } from '../../../types';

export const practice: TopicPractice = {
  slug: 'web-vitals',
  code: {
    input: '用 `PerformanceObserver` 监听 `largest-contentful-paint` 和 `layout-shift` 两类条目，在页面上动态插入一张没有写宽高的图片。',
    output: 'LCP 条目会随着更大的内容出现而多次上报，最后一条才是最终值；插入无尺寸图片后会看到一条 hadRecentInput 为 false 的布局偏移记录并累加进 CLS。这说明这两个指标都是"过程量"，只有在页面生命周期结束时才能确定。',
  },
  reference: {
    caption: '三个核心指标',
    rows: [
      { term: 'LCP', meaning: '视口内最大内容元素的渲染时间，良好阈值 2.5 秒。' },
      { term: 'INP', meaning: '整个访问期间交互到下一次绘制的代表性延迟，良好阈值 200 毫秒。' },
      { term: 'CLS', meaning: '非用户触发的布局偏移得分之和，良好阈值 0.1。' },
      { term: 'TTFB / FCP', meaning: '诊断指标，用来定位 LCP 慢在服务端还是资源加载。' },
      { term: '实验室数据', meaning: 'Lighthouse 等模拟环境，可复现但不代表真实用户。' },
      { term: '真实用户数据', meaning: 'RUM 采集，看 75 分位而不是平均值。' },
    ],
  },
  interview: {
    answer: '核心指标有三个，分别对应加载、交互和视觉稳定。LCP 是视口内最大内容元素的渲染时间，良好阈值是 2.5 秒，慢的原因通常按四段拆：服务端响应慢、资源发现晚、资源本身大、以及渲染被阻塞。INP 取代了 FID，衡量整个访问期间从用户交互到下一帧绘制的代表性延迟，良好阈值 200 毫秒，它同时包含输入延迟、处理时间和呈现延迟，所以长任务、同步布局读取和过重的事件处理器都会拖垮它。CLS 是非用户触发的布局偏移得分之和，良好阈值 0.1，主要来自没写尺寸的图片、动态插入的横幅和字体替换。测量上要区分两类数据：Lighthouse 这类实验室数据可复现、适合在 CI 里做回归，但不代表真实用户；真正的判据是 RUM 采集的真实数据，而且要看 75 分位而不是平均值，因为性能问题总是集中在长尾设备和弱网上。优化顺序我一般是先看瀑布图确认瓶颈段落，再依次处理首屏图片和字体、拆分和延后 JavaScript、给所有占位元素留出尺寸，最后才是细节调优。',
    followUps: [
      'INP 和 FID 的区别是什么，为什么要替换？',
      'LCP 慢应该从哪几个方向排查？',
      '为什么要看 75 分位而不是平均值？',
    ],
  },
};
