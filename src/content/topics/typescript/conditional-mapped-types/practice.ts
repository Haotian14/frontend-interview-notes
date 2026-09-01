import type { TopicPractice } from '../../../types';

export const practice: TopicPractice = {
  slug: 'conditional-mapped-types',
  code: {
    input: '定义 `type NonNull<T> = T extends null | undefined ? never : T`，分别用 `NonNull<string | null>` 和 `NonNull<[string | null]>` 求值；再把裸类型参数包起来写成 `[T] extends [null | undefined] ? ... : ...` 对比。',
    output: '第一种写法对联合类型逐个分发，得到 string；包成元组后条件类型不再分发，整个联合被当作一个整体判断。这说明"分布式"只在类型参数裸露时发生，是控制条件类型行为的关键开关。',
  },
  reference: {
    caption: '常用类型运算与内置工具',
    rows: [
      { term: 'T extends U ? X : Y', meaning: '条件类型；T 为裸类型参数且是联合时会逐成员分发。' },
      { term: 'infer R', meaning: '在条件为真的分支里捕获一个类型，如 ReturnType 的实现。' },
      { term: '[K in keyof T]', meaning: '映射类型，遍历键生成新对象类型。' },
      { term: 'as 子句', meaning: '键重映射，配合模板字面量类型可批量改名或用 never 过滤。' },
      { term: '+/- 修饰符', meaning: '-readonly 与 -? 用来移除只读和可选，Required 与 Mutable 靠它实现。' },
      { term: 'Awaited<T>', meaning: '递归解包 Promise，比手写条件类型更稳妥。' },
    ],
  },
  interview: {
    answer: '条件类型的形式是 T extends U 问号 X 冒号 Y，可以理解成类型层面的三元表达式。最关键也最容易踩的规则是分布式：当被检查的类型是一个裸的类型参数且实参是联合类型时，条件会对联合的每个成员分别求值再合并结果，这就是 Exclude 和 Extract 能工作的原理；如果不想要这个行为，把两边都用元组包一层，写成方括号 T 再 extends 方括号 U，分发就关闭了。infer 用来在条件成立的分支里捕获类型，ReturnType、Parameters、Awaited 都是这么实现的。映射类型是遍历 keyof 生成新对象类型，配合 as 子句可以重命名键，用 never 作为新键名还能过滤属性；加减号修饰符负责添加或移除 readonly 和可选，Partial 和 Required 就是这样定义的。模板字面量类型让键名可以按字符串模式拼接和匹配。我在项目里主要用它们做三件事：从单一数据源派生类型避免重复声明、给事件名和路由这类字符串加约束、以及把接口返回结构映射成前端模型；但会克制使用，因为过深的递归会拖慢编译并产生几乎无法阅读的报错。',
    followUps: [
      '什么是分布式条件类型，怎么关闭它？',
      'infer 的作用是什么，能举一个实现 ReturnType 的例子吗？',
      '类型体操写复杂了会有什么代价？',
    ],
  },
};
