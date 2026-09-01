import type { TopicMeta } from '../../../types';

export const meta: TopicMeta = {
  slug: 'form-validation',
  chapter: 'html-a11y',
  order: 2,
  title: '表单控件与原生校验',
  summary: '用原生表单语义和约束校验 API 建立可访问、可提交、可提示的表单，再决定哪些环节需要自定义。',
  level: '高频',
  minutes: 24,
  keywords: ['表单', '约束校验', 'label', 'aria-describedby', 'required'],
  prerequisites: ['semantic-accessibility'],
  related: ['semantic-accessibility', 'xss-defense'],
  sources: [
    { label: 'MDN — Client-side form validation', href: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation' },
    { label: 'HTML Standard — Constraint validation', href: 'https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#constraints' },
  ],
  searchText: '表单 form 约束校验 constraint validation setCustomValidity checkValidity reportValidity required pattern novalidate label 关联 错误提示 aria-describedby aria-invalid autocomplete inputmode',
  hasCode: true,
};
