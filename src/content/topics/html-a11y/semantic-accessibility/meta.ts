import type { TopicMeta } from '../../../types';

export const meta: TopicMeta = {
  slug: 'semantic-accessibility',
  chapter: 'html-a11y',
  order: 1,
  title: '语义化 HTML 与可访问性',
  summary: '从原生语义、可访问名称和键盘行为出发，构建能被辅助技术理解和操作的界面。',
  level: '基础',
  minutes: 20,
  keywords: ['语义化', 'ARIA', '键盘', '表单'],
  prerequisites: [], // 首章基础专题：只要求通用 HTML 基础，无站内前置专题。
  related: ['stacking-context'],
  sources: [
    { label: 'HTML Standard — Semantics', href: 'https://html.spec.whatwg.org/multipage/dom.html#semantics-2' },
    { label: 'WAI-ARIA Authoring Practices Guide', href: 'https://www.w3.org/WAI/ARIA/apg/' },
  ],
  searchText: '语义化 ARIA 键盘 表单 accessible name role state focus order form error 可访问名称 角色 状态 焦点顺序 表单错误',
  hasCode: true,
};
