import type { TopicPractice } from '../../../types';

export const practice: TopicPractice = {
  slug: 'rendering-pipeline',
  code: {
    input: '在一个循环里对每个元素先写入样式，再立即读取 offsetWidth 等几何属性。',
    output: 'DevTools Performance 面板出现成串的强制同步布局（Layout thrashing）；把读取集中到写入之前，同一批操作的布局次数降为一次。',
  },
  reference: {
    caption: '浏览器渲染阶段速查',
    rows: [
      { term: 'Style', meaning: '为节点计算最终样式。' },
      { term: 'Layout', meaning: '计算几何尺寸与位置。' },
      { term: 'Paint / Composite', meaning: '生成绘制指令并组合图层。' },
      { term: 'transform / opacity', meaning: '合适图层上通常只需合成，不触发布局。' },
    ],
  },
  interview: {
    answer: '导航取得 HTML 后，解析器增量构建 DOM，样式表被解析为 CSSOM；可用的 DOM 与样式规则参与样式计算，再由需要几何信息的节点进入布局，随后生成绘制指令并由合成器组合图层。属性影响的阶段不同：改宽度通常会触发布局及其后续工作，改颜色通常从绘制开始，合适图层上的 transform 或 opacity 常可只合成。先写样式再立刻读取几何属性会迫使浏览器提前完成待处理的样式和布局，应把读取集中在写入之前。事件循环出现渲染机会只代表用户代理可以考虑更新，并不保证每次机会都实际绘制。',
    followUps: [
      '为什么读取 offsetWidth 可能触发强制同步布局？',
      'transform 动画为什么通常比 width 动画平滑？',
      '渲染机会是否等于浏览器一定会绘制一帧？',
    ],
  },
};
