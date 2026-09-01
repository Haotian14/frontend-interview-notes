import type { TopicMeta } from '../../../types';

export const meta: TopicMeta = {
  slug: 'infinite-canvas-architecture',
  chapter: 'engineering',
  order: 5,
  title: '无限画布的状态与渲染架构',
  summary: '拆分世界坐标、视口变换、文档模型和瞬时交互，并用空间索引与分层渲染守住大规模元素性能。',
  level: '进阶',
  minutes: 28,
  keywords: ['无限画布', '坐标变换', '空间索引', '渲染性能', '命令模式'],
  prerequisites: ['rendering-pipeline', 'frontend-system-design'],
  related: ['autosave-conflict-control', 'virtual-list', 'web-vitals'],
  sources: [
    { label: 'MDN — Pointer events', href: 'https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events' },
    { label: 'MDN — Canvas API', href: 'https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API' },
  ],
  searchText: '无限画布 infinite canvas 世界坐标 屏幕坐标 viewport transform pan zoom matrix pointer capture 选择框 多选 对齐线 图层 空间索引 quadtree R-tree virtualization dirty rectangle command undo redo hit test',
  hasCode: true,
};
