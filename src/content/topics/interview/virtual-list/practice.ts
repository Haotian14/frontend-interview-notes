import type { TopicPractice } from '../../../types';

export const practice: TopicPractice = {
  slug: 'virtual-list',
  code: {
    input: '容器高度 600px、固定行高 40px、scrollTop=1000px、overscan=3。计算开始索引、可见数量、结束索引和内容层 translateY。',
    output: '原始开始索引 floor(1000/40)=25；加入前缓冲后 start=22；可见数量 ceil(600/40)=15，结束索引至少覆盖 25~39 并加后缓冲；translateY=start*40=880px。',
  },
  reference: {
    caption: '虚拟列表关键参数',
    rows: [
      { term: 'startIndex', meaning: '固定高度时由 floor(scrollTop / itemHeight) 得到。' },
      { term: 'visibleCount', meaning: 'ceil(viewportHeight / itemHeight)，再增加 overscan。' },
      { term: '总高度占位', meaning: '维持正确滚动条范围，固定高度时为 count × itemHeight。' },
      { term: 'translateY', meaning: '把可见窗口移动到它在完整列表中的视觉位置。' },
      { term: 'overscan', meaning: '视口前后多渲染少量元素，吸收快速滚动和白边。' },
      { term: '动态高度', meaning: '测量真实高度，维护前缀和并二分查找偏移对应索引。' },
    ],
  },
  interview: {
    answer: '虚拟列表的核心是让 DOM 数量与视口高度相关，而不是与数据总量相关。固定高度时，用 floor(scrollTop / itemHeight) 得到开始索引，用 ceil(viewportHeight / itemHeight) 得到可见数量，前后增加 overscan；外层元素提供完整列表总高度，内部只渲染窗口数据并通过 translateY 移到正确位置。滚动事件用 requestAnimationFrame 合帧，避免一帧重复计算。动态高度不能再直接相除，需要用 ResizeObserver 测量每项高度，维护前缀和或 Fenwick Tree，再用二分搜索从偏移找到索引；高度修正时保持顶部可见项作为锚点，防止页面跳动。虚拟化也有边界：列表不够大时收益不抵复杂度，全文查找、浏览器页内搜索、可访问性和焦点管理都需要额外设计。',
    followUps: [
      '固定高度虚拟列表怎样计算可见区间？',
      '动态高度为什么需要前缀和与二分查找？',
      'overscan 太大或太小分别有什么问题？',
      '虚拟列表会对焦点和可访问性造成什么影响？',
    ],
  },
};
