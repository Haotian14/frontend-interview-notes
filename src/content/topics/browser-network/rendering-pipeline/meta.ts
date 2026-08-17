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
  interview: {
    answer: '导航取得 HTML 后，解析器增量构建 DOM，样式表被解析为 CSSOM；可用的 DOM 与样式规则参与样式计算，再由需要几何信息的节点进入布局，随后生成绘制指令并由合成器组合图层。属性影响的阶段不同：改宽度通常会触发布局及其后续工作，改颜色通常从绘制开始，合适图层上的 transform 或 opacity 常可只合成。先写样式再立刻读取几何属性会迫使浏览器提前完成待处理的样式和布局，应把读取集中在写入之前。事件循环出现渲染机会只代表用户代理可以考虑更新，并不保证每次机会都实际绘制。',
    followUps: [
      '为什么读取 offsetWidth 可能触发强制同步布局？',
      'transform 动画为什么通常比 width 动画平滑？',
      '渲染机会是否等于浏览器一定会绘制一帧？',
    ],
  },
};
