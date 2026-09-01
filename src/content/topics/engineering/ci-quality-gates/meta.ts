import type { TopicMeta } from '../../../types';

export const meta: TopicMeta = {
  slug: 'ci-quality-gates',
  chapter: 'engineering',
  order: 4,
  title: 'CI 质量闸门与发布',
  summary: '把类型、lint、测试、体积和可访问性变成自动闸门，并用灰度、特性开关与快速回滚降低发布风险。',
  level: '进阶',
  minutes: 22,
  keywords: ['CI', '质量闸门', '灰度发布', '特性开关', '回滚'],
  prerequisites: ['testing-strategy'],
  related: ['testing-strategy', 'bundling-tree-shaking', 'error-monitoring'],
  sources: [
    { label: 'Martin Fowler — Continuous Integration', href: 'https://martinfowler.com/articles/continuousIntegration.html' },
    { label: 'web.dev — Performance budgets 101', href: 'https://web.dev/articles/performance-budgets-101' },
  ],
  searchText: 'CI 持续集成 质量闸门 quality gate lint 类型检查 单元测试 端到端测试 体积预算 performance budget 可访问性检查 缓存依赖 并行任务 灰度发布 金丝雀 特性开关 feature flag 回滚 语义化版本',
  hasCode: true,
};
