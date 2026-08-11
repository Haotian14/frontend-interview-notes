import type { TopicMeta } from '../../../types';

export const meta: TopicMeta = {
  slug: 'stacking-context',
  chapter: 'css',
  order: 1,
  title: '层叠上下文与 z-index',
  summary: '用包含关系和层叠顺序解释 z-index 失效，并区分 CSS 绘制顺序与浏览器合成优化。',
  level: '高频',
  minutes: 24,
  keywords: ['层叠上下文', 'z-index', '定位', '合成层'],
  prerequisites: [],
  related: ['semantic-accessibility'],
  sources: [
    { label: 'MDN — Stacking context', href: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_positioned_layout/Stacking_context' },
    { label: 'CSS Positioned Layout Module Level 3', href: 'https://www.w3.org/TR/css-position-3/' },
  ],
  searchText: '层叠顺序 stacking order 层叠上下文 containing contexts 包含上下文 z-index 定位 合成层 compositing layers',
  hasCode: true,
  interview: {
    answer: 'z-index 不是全局数值竞赛，而是在当前层叠上下文中决定层叠级别。根元素、带非 auto z-index 的定位元素、fixed 或 sticky 元素，以及 opacity 小于 1、transform、filter、isolation 等属性都可能创建新上下文。一个上下文作为整体参与父上下文排序，所以较低父级里的子元素即使写 z-index: 9999，也不能越过父上下文中层级更高的兄弟。排查时先沿祖先链找上下文，再比较同一上下文的层叠顺序。层叠上下文是 CSS 绘制规则，合成层是浏览器实现优化，二者相关但不能等同。',
    followUps: [
      '哪些常见 CSS 属性会意外创建层叠上下文？',
      '为什么给子元素继续增大 z-index 通常不能解决遮挡？',
      '层叠上下文与 GPU 合成层有什么区别？',
    ],
  },
};
