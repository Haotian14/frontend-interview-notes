import type { TopicMeta } from '../../../types';

export const meta: TopicMeta = {
  slug: 'flex-grid-layout',
  chapter: 'css',
  order: 3,
  title: 'Flexbox 与 Grid 布局模型',
  summary: '按一维与二维划分选型，讲清 flex 的伸缩三属性、Grid 的轨道与放置模型，以及溢出与最小尺寸的真正原因。',
  level: '高频',
  minutes: 28,
  keywords: ['flexbox', 'grid', 'flex-basis', 'minmax', 'min-width auto', '对齐'],
  prerequisites: ['cascade-specificity'],
  related: ['cascade-specificity', 'bfc-margin-collapse'],
  sources: [
    { label: 'MDN — CSS flexible box layout', href: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout' },
    { label: 'CSS Grid Layout Module Level 1', href: 'https://www.w3.org/TR/css-grid-1/' },
  ],
  searchText: 'flexbox 弹性盒 flex-grow flex-shrink flex-basis flex: 1 grid 网格 grid-template-columns repeat auto-fit auto-fill minmax fr 单位 gap 对齐 justify-content align-items place-items min-width auto 溢出 内容最小尺寸 subgrid',
  hasCode: true,
};
