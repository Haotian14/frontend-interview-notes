import type { TopicMeta } from '../../../types';

export const meta: TopicMeta = {
  slug: 'testing-strategy',
  chapter: 'engineering',
  order: 1,
  title: '前端测试策略与分层',
  summary: '按失败风险和反馈速度分配单元、组件集成与端到端测试，并让断言贴近用户行为。',
  level: '进阶',
  minutes: 24,
  keywords: ['测试分层', '风险', '角色查询', 'Mock', '覆盖率'],
  prerequisites: ['semantic-accessibility'],
  related: ['semantic-accessibility'],
  sources: [
    { label: 'Testing Library — Guiding Principles', href: 'https://testing-library.com/docs/guiding-principles/' },
    { label: 'Vitest — Guide', href: 'https://vitest.dev/guide/' },
    { label: 'Playwright — Best Practices', href: 'https://playwright.dev/docs/best-practices' },
  ],
  searchText: 'frontend testing strategy 前端测试策略 test levels 测试分层 risk 风险 feedback speed 反馈速度 role queries 角色查询 mocks 外部边界 coverage 覆盖率 regression 回归 Vitest Testing Library Playwright',
  hasCode: true,
};
