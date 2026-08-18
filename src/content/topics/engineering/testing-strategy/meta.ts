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
  code: {
    input: '同一个表单组件写两版测试：一版用 `getByTestId` 断言内部实现，一版用 `getByRole` 按角色与可访问名称查询提交按钮。',
    output: '重构内部结构后 testid 版本大面积失败但产品行为没变；角色版本继续通过，且在可访问名称丢失时才失败——测试同时约束了可访问接口。',
  },
  reference: {
    caption: '测试层级选择',
    rows: [
      { term: '单元测试', meaning: '快速验证纯规则和边界。' },
      { term: '组件集成测试', meaning: '验证组件、路由和状态协作。' },
      { term: '端到端测试', meaning: '覆盖少量关键跨页面链路。' },
      { term: '只 mock 外部边界', meaning: '网络、时间、随机数；不模拟被验证的内部实现。' },
    ],
  },
  interview: {
    answer: '我按故障风险和反馈速度选择测试层级，而不是追求固定比例：纯规则放在快速单元测试，组件与真实子组件、路由或状态协作放在组件集成测试，只有跨页面、浏览器能力和关键业务链路交给少量 E2E。查询和操作尽量使用用户可感知的角色、名称与文本，让测试同时约束可访问接口。只模拟网络、时间、随机数等不可控外部边界，不模拟正在验证的内部实现。覆盖率只能发现未执行代码，不能证明断言质量；回归缺陷、变更频率和业务损失才决定优先级。',
    followUps: [
      '组件测试和 E2E 测试的边界如何确定？',
      '为什么优先使用 getByRole 而不是 data-testid？',
      '高覆盖率为什么仍可能漏掉严重缺陷？',
    ],
  },
};
