import type { TopicPractice } from '../../../types';

export const practice: TopicPractice = {
  slug: 'flex-grid-layout',
  code: {
    input: '在 `display: flex` 的容器里放一个含长英文单词或 `overflow-x: auto` 表格的子项，观察它把容器撑破。',
    output: '子项的 `min-width` 初始值是 `auto`（取内容最小尺寸），所以 `flex-shrink` 收缩不到那么小；显式写 `min-width: 0`（或 `overflow: hidden`）后子项才能真正被压缩。Grid 轨道同理，需要 `minmax(0, 1fr)`。',
  },
  reference: {
    caption: '选型与常用写法',
    rows: [
      { term: '一维排布', meaning: '内容决定换行位置、只关心一个方向时用 flex。' },
      { term: '二维对齐', meaning: '行列同时需要对齐、需要重叠或命名区域时用 grid。' },
      { term: 'flex: 1', meaning: '展开为 1 1 0%，等分剩余空间且忽略内容宽度。' },
      { term: 'flex: auto', meaning: '展开为 1 1 auto，按内容宽度为基准再分配。' },
      { term: 'repeat(auto-fit, minmax(240px, 1fr))', meaning: '无媒体查询的响应式卡片网格。' },
      { term: 'minmax(0, 1fr)', meaning: '允许轨道小于内容最小尺寸，避免溢出。' },
    ],
  },
  interview: {
    answer: '选型看维度：只关心一个方向的排布、换行位置由内容决定，用 Flexbox；行和列需要同时对齐、需要命名区域或元素重叠，用 Grid。Flex 的核心是 flex-basis 先确定基准尺寸，然后按 flex-grow 分配剩余空间、按 flex-shrink 加权收缩超出部分，所以 flex: 1 是 1 1 0%，等分剩余空间；flex: auto 是 1 1 auto，会保留内容宽度差异。Grid 的核心是先定义轨道再放置项目，fr 分配的是剩余空间，repeat 配 auto-fit 和 minmax 可以不用媒体查询做响应式。最常被问的坑是溢出：flex 项目和 grid 轨道的最小尺寸默认是内容最小尺寸，也就是 min-width 初始值为 auto，所以长单词或不换行的表格会撑破容器，需要写 min-width: 0 或者把轨道写成 minmax(0, 1fr)。对齐方面两者共用 box alignment 那一套属性，justify 管内联轴、align 管块轴，gap 现在两边都支持。',
    followUps: [
      'flex: 1 和 flex: auto 的区别在哪里？',
      '为什么 flex 子项会被内容撑破，min-width: 0 为什么能解决？',
      'auto-fit 和 auto-fill 有什么不同？',
    ],
  },
};
