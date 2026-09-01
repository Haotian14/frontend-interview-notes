import type { TopicPractice } from '../../../types';

export const practice: TopicPractice = {
  slug: 'generics-constraints',
  code: {
    input: '写 `function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>`，用一个具体对象调用它并把结果赋给错误的类型看报错。',
    output: '返回类型随传入的键名精确变化，写错键名在调用处就报错而不是在使用结果时才发现。对比不带约束的 `pick(obj, keys: string[]): any`，可以直观看到"泛型的价值在于建立参数与返回值之间的关系"。',
  },
  reference: {
    caption: '泛型常用工具与写法',
    rows: [
      { term: 'T extends U', meaning: '约束：T 必须可赋值给 U，同时让 T 内部成员可访问。' },
      { term: 'K extends keyof T', meaning: '把键名限制在对象已有的键上，最常用的约束形式。' },
      { term: 'T[K]', meaning: '索引访问类型，取出属性的类型。' },
      { term: 'T = 默认类型', meaning: '默认类型参数，让调用方可以省略。' },
      { term: 'const T extends readonly unknown[]', meaning: 'const 类型参数，保留字面量与元组的窄类型。' },
      { term: 'NoInfer<T>', meaning: '排除某个位置参与推断，避免类型被意外放宽。' },
    ],
  },
  interview: {
    answer: '泛型不是为了让函数"什么都能接受"，而是为了在参数与返回值之间建立可追踪的关系。判断一个泛型参数是否必要有个简单标准：它至少要在两个位置出现，否则它就等价于 any 或 unknown，只是看起来更专业。约束用 extends 表达，含义是"这个类型参数必须可赋值给约束类型"，最常见的形式是 K extends keyof T，它让键名只能取对象真实存在的键，返回类型再用索引访问 T[K] 精确算出来。推断方面，TypeScript 从实参位置反推类型参数，所以参数的写法直接决定推断结果，字面量默认会被放宽成 string 或 number，需要保留窄类型时用 const 类型参数或 as const。另外还有默认类型参数和 NoInfer，前者让调用方省略，后者阻止某个位置参与推断以免类型被放宽。工程上我的原则是先写具体类型，等到出现第二个几乎相同的签名时再抽象成泛型，过早泛型化会让签名难读且报错信息难以理解。',
    followUps: [
      '什么时候一个泛型参数其实是多余的？',
      'K extends keyof T 相比 string 有什么实际收益？',
      '为什么泛型函数里的类型参数不能直接当作具体类型使用？',
    ],
  },
};
