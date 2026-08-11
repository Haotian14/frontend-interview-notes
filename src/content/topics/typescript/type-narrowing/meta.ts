import type { TopicMeta } from '../../../types';

export const meta: TopicMeta = {
  slug: 'type-narrowing',
  chapter: 'typescript',
  order: 1,
  title: '类型收窄与穷尽检查',
  summary: '从不可信输入到可辨识联合，使用运行时检查建立可靠的类型分支与状态模型。',
  level: '高频',
  minutes: 24,
  keywords: ['unknown', '类型守卫', '可辨识联合', 'never'],
  prerequisites: [],
  related: ['event-loop'],
  sources: [
    { label: 'TypeScript Handbook — Narrowing', href: 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html' },
    { label: 'TypeScript Handbook — Unions and Intersection Types', href: 'https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html' },
  ],
  searchText: 'unknown any 类型守卫 typeof in instanceof custom predicate assertions 类型断言 runtime validation 运行时校验 discriminated union 可辨识联合 never exhaustive checks 穷尽检查',
  hasCode: true,
  interview: {
    answer: '类型收窄是 TypeScript 根据控制流和运行时判断，把较宽类型缩小到当前分支可安全使用的类型。外部输入应先用 unknown 承接，再通过 typeof、in、instanceof 或经过验证的自定义谓词收窄；any 会绕过检查，as 断言也只改变编译器看法，不能验证 API 响应。业务状态适合建模为带共同判别字段的可辨识联合，switch 后把剩余值交给接收 never 的 assertNever，这样新增分支时编译器会指出遗漏。边界处运行时校验、内部精确联合和穷尽检查结合起来，才能让类型反映真实数据。',
    followUps: [
      'unknown 为什么比 any 更适合表示 API 响应？',
      '自定义类型谓词写错会带来什么风险？',
      '如何用 never 让新增联合成员触发编译错误？',
    ],
  },
};
