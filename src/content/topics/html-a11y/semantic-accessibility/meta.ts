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
  interview: {
    answer: '我会先选有正确语义和交互行为的原生 HTML，因为 button、label、input 等元素已经向可访问性树暴露名称、角色和状态，并提供键盘及焦点行为。只有原生元素无法表达组件语义时才使用 ARIA，而且 ARIA 只补充语义，不会自动实现事件、焦点管理或键盘交互。验证时我会检查可访问名称是否稳定、角色与状态是否准确、Tab 焦点顺序是否符合视觉和阅读顺序、表单错误是否通过 aria-describedby 与控件关联，并用键盘、屏幕阅读器、200% 缩放和自动化检查共同测试。',
    followUps: [
      '为什么给 div 添加 role="button" 仍然不等于原生 button？',
      'aria-label、aria-labelledby 和可见文本应该如何选择？',
      '动态表单错误应如何关联并在合适时机播报？',
    ],
  },
};
