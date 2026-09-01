import type { TopicMeta } from '../../../types';

export const meta: TopicMeta = {
  slug: 'generics-constraints',
  chapter: 'typescript',
  order: 2,
  title: '泛型与约束',
  summary: '把泛型当作类型之间的函数，用 extends 约束、默认值和推断位置解决"能用但不精确"的类型问题。',
  level: '高频',
  minutes: 24,
  keywords: ['泛型', 'extends 约束', '类型推断', 'keyof', '默认类型参数'],
  prerequisites: ['type-narrowing'],
  related: ['type-narrowing', 'conditional-mapped-types', 'structural-variance'],
  sources: [
    { label: 'TypeScript Handbook — Generics', href: 'https://www.typescriptlang.org/docs/handbook/2/generics.html' },
    { label: 'TypeScript Handbook — Type Inference', href: 'https://www.typescriptlang.org/docs/handbook/type-inference.html' },
  ],
  searchText: '泛型 generics 类型参数 extends 约束 constraint keyof 索引访问 默认类型参数 类型推断 推断位置 const 类型参数 泛型函数 泛型接口 过度泛型 any unknown',
  hasCode: true,
};
