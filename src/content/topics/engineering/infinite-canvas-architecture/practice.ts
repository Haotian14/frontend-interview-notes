import type { TopicPractice } from '../../../types';

export const practice: TopicPractice = {
  slug: 'infinite-canvas-architecture',
  code: {
    input: '给定视口平移 tx=120、ty=80、缩放 scale=2，以及屏幕点 (520, 380)，实现 screenToWorld，再把结果用 worldToScreen 转回。',
    output: '世界坐标为 ((520-120)/2, (380-80)/2) = (200,150)，反向转换后必须回到 (520,380)。缩放中心变化时也应保持往返误差在浮点容差内。',
  },
  reference: {
    caption: '无限画布状态分层',
    rows: [
      { term: '文档状态', meaning: '节点、层级、世界坐标和持久属性，可撤销、可保存。' },
      { term: '视口状态', meaning: '平移、缩放和可见区域，通常不进入文档保存历史。' },
      { term: '选择状态', meaning: '当前选中 id、主选中项和编辑焦点，属于会话 UI。' },
      { term: '瞬时交互', meaning: '拖拽起点、指针位置、吸附候选和预览变换，高频但不持久化。' },
      { term: '命令历史', meaning: '保存语义操作及其逆操作，不记录每个 pointermove。' },
      { term: '空间索引', meaning: '按世界包围盒查询可见节点和命中候选，避免全量遍历。' },
    ],
  },
  interview: {
    answer: '我会先把无限画布拆成四层状态：文档模型保存节点、层级和世界坐标；视口只保存平移缩放；选择状态保存当前选中项；拖拽起点、吸附线和预览矩阵属于高频瞬时交互。所有节点数据都使用世界坐标，PointerEvent 先通过视口逆矩阵转成世界坐标，渲染时再走正向矩阵，这样缩放和平移不会污染业务数据。渲染层要根据元素类型和规模选择 DOM、Canvas 或混合方案，大量元素不能每帧全量遍历，而是用 R-tree 或四叉树按包围盒查询可见节点和命中候选。拖拽过程中只更新内存预览并用 requestAnimationFrame 合帧，pointerup 时形成一条语义命令，进入撤销栈和保存队列。复杂能力的关键不是先加对齐线和图层面板，而是先稳定坐标、状态分层、命令和渲染边界。',
    followUps: [
      '为什么节点数据必须保存世界坐标而不是屏幕坐标？',
      'DOM、Canvas 和混合渲染应该如何选择？',
      '拖拽、撤销和自动保存怎样避免记录每一帧？',
      '海量节点时命中测试为什么需要空间索引？',
    ],
  },
};
