import type { TopicMeta } from '../../../types';

export const meta: TopicMeta = {
  slug: 'cascade-specificity',
  chapter: 'css',
  order: 2,
  title: '层叠、优先级与继承',
  summary: '按来源、层、作用域、优先级、顺序的完整层叠顺序解释样式为什么生效，并用 layer 取代 !important 竞赛。',
  level: '高频',
  minutes: 24,
  keywords: ['层叠', '优先级', 'specificity', '继承', 'cascade layer', '!important'],
  prerequisites: ['semantic-accessibility'],
  related: ['stacking-context', 'flex-grid-layout'],
  sources: [
    { label: 'MDN — Cascade, specificity, and inheritance', href: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascade/Cascade' },
    { label: 'CSS Cascading and Inheritance Level 5', href: 'https://www.w3.org/TR/css-cascade-5/' },
  ],
  searchText: '层叠 cascade 优先级 specificity 权重 继承 inheritance !important cascade layer @layer :where :is 作用域 scope 内联样式 来源 origin 用户代理样式 initial inherit unset revert',
  hasCode: true,
};
