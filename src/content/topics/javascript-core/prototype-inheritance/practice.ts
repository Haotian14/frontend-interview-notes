import type { TopicPractice } from '../../../types';

export const practice: TopicPractice = {
  slug: 'prototype-inheritance',
  code: {
    input: '定义 `function Point(x) { this.x = x }`，在 `Point.prototype` 上加方法，然后分别打印 `p.__proto__ === Point.prototype`、`Point.prototype.constructor` 和 `Object.getPrototypeOf(Point.prototype)`。',
    output: '实例的原型就是构造函数的 prototype 对象；prototype.constructor 指回构造函数本身；再往上是 Object.prototype，然后是 null。整条链就是属性查找的路径，方法之所以能共享正是因为它们只存在于链上的一个节点。',
  },
  reference: {
    caption: '原型相关 API 的分工',
    rows: [
      { term: 'Fn.prototype', meaning: '函数上的属性，将成为用 new 创建的实例的原型。' },
      { term: 'Object.getPrototypeOf(obj)', meaning: '读取实例真正的原型，取代已废弃的 __proto__。' },
      { term: 'Object.create(proto)', meaning: '以指定对象为原型创建新对象；传 null 得到无原型对象。' },
      { term: 'Object.setPrototypeOf', meaning: '能改但会让引擎的内联缓存失效，性能很差。' },
      { term: 'obj.hasOwnProperty(k)', meaning: '只看自有属性，不沿原型链查找。' },
      { term: 'Object.hasOwn(obj, k)', meaning: '现代替代写法，对无原型对象也安全。' },
    ],
  },
  interview: {
    answer: '每个对象都有一个内部的原型引用，读属性时先看自有属性，找不到就沿原型链一路向上，直到 null 为止；写属性则默认只写在自身上，形成对原型同名属性的屏蔽。容易混淆的是 prototype 和 __proto__：prototype 是函数才有的属性，它指向的对象将成为实例的原型；实例上的 __proto__ 才是那条链，现在应该用 Object.getPrototypeOf 读取。new 做四件事：创建一个以构造函数 prototype 为原型的空对象，把它作为 this 执行构造函数，如果构造函数返回对象就用那个对象，否则返回新建的对象。class 是语法糖，方法定义在 prototype 上，extends 同时接起实例链和静态链，super 调用父类构造并绑定 this；但它也带来真正的语义差别，比如类体是严格模式、不提升、必须用 new 调用。工程上要注意两点：instanceof 检查的是原型链而不是构造函数身份，跨 iframe 或多份库副本会失效，用 Array.isArray 或 Symbol.hasInstance 更稳；以及原型污染，合并对象时必须拒绝 __proto__ 和 constructor 这类键。',
    followUps: [
      'prototype 和 __proto__ 有什么区别？',
      'new 操作符具体做了哪几步，怎么手写实现？',
      'class 相比构造函数除了语法还有哪些真实差别？',
    ],
  },
};
