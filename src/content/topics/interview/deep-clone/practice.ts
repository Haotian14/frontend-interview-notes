import type { TopicPractice } from '../../../types';

export const practice: TopicPractice = {
  slug: 'deep-clone',
  code: {
    input: '构造一个含 `Date`、`Map`、`undefined` 值、`NaN` 和自引用的对象，先用 `JSON.parse(JSON.stringify(obj))` 拷贝，再用 `structuredClone` 拷贝。',
    output: 'JSON 往返会把 Date 变成字符串、Map 变成空对象、undefined 属性直接消失、NaN 变成 null，遇到自引用直接抛 TypeError；structuredClone 全部正确保留并能处理循环引用，但遇到函数会抛 DataCloneError。这组对比说明拷贝方案的选择取决于数据里有什么。',
  },
  reference: {
    caption: '三种方案的适用范围',
    rows: [
      { term: '展开运算符 / Object.assign', meaning: '浅拷贝，只复制第一层，嵌套对象仍是同一引用。' },
      { term: 'JSON 往返', meaning: '只适用于纯 JSON 数据；丢失 Date、Map、undefined，遇循环引用抛错。' },
      { term: 'structuredClone', meaning: '原生支持循环引用与多数内置类型；不支持函数、DOM 节点、原型链。' },
      { term: '手写递归', meaning: '可控但要自己处理循环引用、特殊类型与原型。' },
      { term: '库实现', meaning: 'lodash cloneDeep 覆盖最全，代价是体积。' },
      { term: '结构共享', meaning: 'Immer 等只复制被修改的路径，性能优于全量深拷贝。' },
    ],
  },
  interview: {
    answer: '先问清楚数据里有什么，再选方案。如果是纯 JSON 数据，JSON 往返最简单，但它会把 Date 变成字符串、Map 和 Set 变成空对象、值为 undefined 的属性直接丢掉、NaN 和 Infinity 变成 null，遇到循环引用还会抛错。现在浏览器和 Node 都提供了原生的 structuredClone，它基于结构化克隆算法，支持循环引用、Date、Map、Set、RegExp、ArrayBuffer 甚至 Blob，是默认首选；限制是不能克隆函数、DOM 节点、Symbol，也不保留原型链，克隆类实例得到的是普通对象。需要覆盖这些情况才手写递归，核心是三点：用 WeakMap 记录已拷贝过的对象来处理循环引用，按类型分别处理 Date、Map、Set、RegExp 这些内置对象，以及用 Object.create 配合 getPrototypeOf 保留原型。手写还要注意递归太深会爆栈，数据层级不确定时应该改成显式栈的迭代写法。最后我想强调，很多时候根本不需要深拷贝：React 里更新状态只需要沿修改路径创建新对象，其余部分结构共享即可，Immer 就是把这件事自动化，全量深拷贝反而会造成不必要的内存和 GC 压力。',
    followUps: [
      'JSON 往返会丢失哪些信息？',
      '手写深拷贝怎么处理循环引用？',
      'structuredClone 有哪些限制？',
    ],
  },
};
