import type { TopicMeta } from '../../../types';

export const meta: TopicMeta = {
  slug: 'conditional-mapped-types',
  chapter: 'typescript',
  order: 3,
  title: '条件类型与映射类型',
  summary: '用条件类型、infer 与映射类型在类型层做计算，理解分布式条件类型这一最容易踩的规则。',
  level: '进阶',
  minutes: 26,
  keywords: ['条件类型', 'infer', '映射类型', '分布式条件类型', '模板字面量类型'],
  prerequisites: ['generics-constraints'],
  related: ['generics-constraints', 'structural-variance'],
  sources: [
    { label: 'TypeScript Handbook — Conditional Types', href: 'https://www.typescriptlang.org/docs/handbook/2/conditional-types.html' },
    { label: 'TypeScript Handbook — Mapped Types', href: 'https://www.typescriptlang.org/docs/handbook/2/mapped-types.html' },
  ],
  searchText: '条件类型 conditional type extends 三元 infer 推断 映射类型 mapped type keyof in 修饰符 readonly 可选 as 重映射 分布式条件类型 distributive 模板字面量类型 template literal type Exclude Extract ReturnType Awaited',
  hasCode: true,
};
