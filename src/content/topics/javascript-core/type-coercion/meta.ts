import type { TopicMeta } from '../../../types';

export const meta: TopicMeta = {
  slug: 'type-coercion',
  chapter: 'javascript-core',
  order: 4,
  title: '类型转换与相等比较',
  summary: '用抽象操作解释隐式转换的规则，说明 == 的比较步骤、NaN 与 -0 的特殊性，以及可靠的类型判断方式。',
  level: '基础',
  minutes: 24,
  keywords: ['类型转换', '相等比较', 'ToPrimitive', 'NaN', '可选链', '空值合并'],
  prerequisites: ['prototype-inheritance'],
  related: ['prototype-inheritance', 'type-narrowing'],
  sources: [
    { label: 'MDN — Equality comparisons and sameness', href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Equality_comparisons_and_sameness' },
    { label: 'ECMAScript — Type Conversion', href: 'https://tc39.es/ecma262/#sec-type-conversion' },
  ],
  searchText: '类型转换 隐式转换 显式转换 ToPrimitive ToNumber ToString ToBoolean 抽象相等 == 严格相等 === Object.is NaN 判断 -0 假值 falsy 空值合并 ?? 可选链 ?. typeof null 数组判断',
  hasCode: true,
};
