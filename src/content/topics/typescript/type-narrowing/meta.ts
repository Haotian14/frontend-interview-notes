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
  prerequisites: ['event-loop'],
  related: ['event-loop'],
  sources: [
    { label: 'TypeScript Handbook — Narrowing', href: 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html' },
    { label: 'TypeScript Handbook — Unions and Intersection Types', href: 'https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html' },
  ],
  searchText: 'unknown any 类型守卫 typeof in instanceof custom predicate assertions 类型断言 runtime validation 运行时校验 discriminated union 可辨识联合 never exhaustive checks 穷尽检查',
  hasCode: true,
};
