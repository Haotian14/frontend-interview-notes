import type { TopicMeta } from '../../../types';

export const meta: TopicMeta = {
  slug: 'rendering-pipeline',
  chapter: 'browser-network',
  order: 1,
  title: '浏览器渲染流水线',
  summary: '从文档获取、DOM 与 CSSOM 构建到样式、布局、绘制和合成，定位页面更新的真实成本。',
  level: '高频',
  minutes: 28,
  keywords: ['DOM', 'CSSOM', '布局', '绘制', '合成'],
  prerequisites: ['event-loop'],
  related: ['stacking-context'],
  sources: [
    { label: 'HTML Standard — Parsing HTML documents', href: 'https://html.spec.whatwg.org/multipage/parsing.html' },
    { label: 'web.dev — Rendering performance', href: 'https://web.dev/articles/rendering-performance' },
  ],
  searchText: 'browser rendering pipeline 浏览器渲染流水线 DOM CSSOM style 样式计算 layout reflow 布局 paint 绘制 composite 合成 forced synchronous layout 强制同步布局 rendering opportunity',
  hasCode: true,
};
