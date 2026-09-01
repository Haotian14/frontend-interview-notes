import type { TopicMeta } from '../../../types';

export const meta: TopicMeta = {
  slug: 'bfc-margin-collapse',
  chapter: 'css',
  order: 4,
  title: 'BFC 与外边距折叠',
  summary: '用块格式化上下文解释高度塌陷、外边距折叠和浮动环绕，并给出现代布局下更合适的替代方案。',
  level: '基础',
  minutes: 20,
  keywords: ['BFC', '外边距折叠', '高度塌陷', '浮动', 'display: flow-root'],
  prerequisites: ['flex-grid-layout'],
  related: ['flex-grid-layout', 'stacking-context'],
  sources: [
    { label: 'MDN — Block formatting context', href: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_display/Block_formatting_context' },
    { label: 'MDN — Mastering margin collapsing', href: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_box_model/Mastering_margin_collapsing' },
  ],
  searchText: 'BFC 块格式化上下文 block formatting context 外边距折叠 margin collapsing 相邻兄弟 父子折叠 空块折叠 高度塌陷 清除浮动 clearfix overflow hidden display flow-root 浮动环绕',
  hasCode: true,
};
