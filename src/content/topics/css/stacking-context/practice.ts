import type { TopicPractice } from '../../../types';

export const practice: TopicPractice = {
  slug: 'stacking-context',
  code: {
    input: '给父元素加上 `opacity: .99`（或 `transform: translateZ(0)`），子元素保持 `position: relative; z-index: 9999`，与父元素的兄弟节点比较层叠结果。',
    output: '子元素无法越过父级层叠上下文中层级更高的兄弟；去掉父元素那条属性后 z-index 立刻"恢复生效"——说明问题从来不在数值大小，而在上下文归属。',
  },
  reference: {
    caption: '会创建层叠上下文的常见属性',
    rows: [
      { term: 'position + z-index ≠ auto', meaning: '最经典的创建方式。' },
      { term: 'opacity < 1', meaning: '最容易被忽略的意外来源。' },
      { term: 'transform / filter', meaning: '动画和视觉效果的常见副作用。' },
      { term: 'isolation: isolate', meaning: '显式创建，用来主动隔离层叠范围。' },
    ],
  },
  interview: {
    answer: 'z-index 不是全局数值竞赛，而是在当前层叠上下文中决定层叠级别。根元素、带非 auto z-index 的定位元素、fixed 或 sticky 元素，以及 opacity 小于 1、transform、filter、isolation 等属性都可能创建新上下文。一个上下文作为整体参与父上下文排序，所以较低父级里的子元素即使写 z-index: 9999，也不能越过父上下文中层级更高的兄弟。排查时先沿祖先链找上下文，再比较同一上下文的层叠顺序。层叠上下文是 CSS 绘制规则，合成层是浏览器实现优化，二者相关但不能等同。',
    followUps: [
      '哪些常见 CSS 属性会意外创建层叠上下文？',
      '为什么给子元素继续增大 z-index 通常不能解决遮挡？',
      '层叠上下文与 GPU 合成层有什么区别？',
    ],
  },
};
