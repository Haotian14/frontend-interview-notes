import type { TopicPractice } from '../../../types';

export const practice: TopicPractice = {
  slug: 'type-coercion',
  code: {
    input: '依次求值 `[] + []`、`[] + {}`、`1 + "2"`、`"3" - 1`、`null == undefined`、`null >= 0` 和 `NaN === NaN`。',
    output: '加号先做 ToPrimitive 且任一侧为字符串就走拼接，减号只走数值转换；null 与 undefined 在 == 下互等但不等于其它任何值，可是关系运算符 >= 会把 null 转成 0 因而为真；NaN 与自己都不相等。这组结果说明"记结论"没用，要记的是每个运算符调用了哪个抽象操作。',
  },
  reference: {
    caption: '八个假值与常见判断写法',
    rows: [
      { term: '假值全集', meaning: 'false、0、-0、0n、""、null、undefined、NaN，其余一律为真。' },
      { term: '空数组与空对象', meaning: '都是真值；判断"空"必须看 length 或 Object.keys。' },
      { term: 'Number.isNaN(x)', meaning: '判断 NaN 的唯一可靠方式，全局 isNaN 会先做类型转换。' },
      { term: 'Object.is(x, y)', meaning: '与 === 的差别只在 NaN 相等、+0 与 -0 不等。' },
      { term: 'typeof null', meaning: '返回 "object"，是无法修复的历史遗留。' },
      { term: 'value ?? fallback', meaning: '只在 null 或 undefined 时回退，0 和空串会被保留。' },
    ],
  },
  interview: {
    answer: '隐式转换不是随机的，每个运算符都规定了自己调用哪个抽象操作。加号两边先做 ToPrimitive，只要有一边得到字符串就变成拼接，否则都转成数字；减法、乘法这类只走数值转换；比较运算符除了双等号之外也走数值转换。ToPrimitive 对对象会依次尝试 Symbol.toPrimitive、valueOf 和 toString，数组的 toString 是用逗号连接元素，这就解释了空数组加空数组得到空字符串。双等号的规则是有限的几条：同类型直接比较，null 和 undefined 只互等，数字和字符串比较时字符串转数字，布尔先转数字，对象与原始值比较时对象先 ToPrimitive。所以除了刻意写 x == null 来同时判断两种空值之外，我一律用三等号。三等号和 Object.is 的差别只有两处，NaN 和正负零。工程上我的规则是：判断存在用 == null 或者可选链和空值合并，判断类型用 typeof 处理原始值、Array.isArray 处理数组、Object.prototype.toString 兜底，判断 NaN 用 Number.isNaN，绝不依赖真假值来判断空数组或空对象，因为它们都是真值。',
    followUps: [
      '为什么 [] + {} 和 {} + [] 结果可能不同？',
      '=== 和 Object.is 有哪些差别？',
      '?? 和 || 的区别是什么，什么时候必须用前者？',
    ],
  },
};
