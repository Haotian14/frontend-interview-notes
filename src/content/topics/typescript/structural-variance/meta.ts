import type { TopicMeta } from '../../../types';

export const meta: TopicMeta = {
  slug: 'structural-variance',
  chapter: 'typescript',
  order: 4,
  title: '结构化类型与型变',
  summary: '解释结构化赋值兼容、多余属性检查、函数参数的双变妥协，以及只读与可变的型变差异。',
  level: '进阶',
  minutes: 24,
  keywords: ['结构化类型', '型变', '协变', '逆变', '多余属性检查', 'strictFunctionTypes'],
  prerequisites: ['generics-constraints'],
  related: ['generics-constraints', 'conditional-mapped-types', 'type-narrowing'],
  sources: [
    { label: 'TypeScript Handbook — Type Compatibility', href: 'https://www.typescriptlang.org/docs/handbook/type-compatibility.html' },
    { label: 'TypeScript — strictFunctionTypes', href: 'https://www.typescriptlang.org/tsconfig/#strictFunctionTypes' },
  ],
  searchText: '结构化类型 structural typing 鸭子类型 赋值兼容 型变 variance 协变 covariant 逆变 contravariant 双变 bivariant 多余属性检查 excess property check 品牌类型 branded type strictFunctionTypes 数组协变 unsound',
  hasCode: true,
};
