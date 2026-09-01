import type { TopicPractice } from '../../../types';

export const practice: TopicPractice = {
  slug: 'this-binding',
  code: {
    input: '把对象方法 `obj.method` 直接作为回调传给 `setTimeout`，再换成 `() => obj.method()` 和 `obj.method.bind(obj)` 各试一次。',
    output: '直接传入时 this 变成默认绑定（严格模式下是 undefined，会抛 TypeError）；箭头函数保留了调用点上的 obj，bind 则永久固定了 this。说明 this 与函数定义位置无关，只与调用点有关。',
  },
  reference: {
    caption: 'this 的判定顺序（从上往下先命中者胜出）',
    rows: [
      { term: 'new Fn()', meaning: 'this 是新创建的对象。' },
      { term: 'fn.call / apply / bind', meaning: 'this 是显式传入的值；bind 后不可再改。' },
      { term: 'obj.fn()', meaning: 'this 是调用点前面的那个对象，只看最后一层。' },
      { term: '独立调用 fn()', meaning: '严格模式下是 undefined，非严格下是全局对象。' },
      { term: '箭头函数', meaning: '没有自己的 this，沿词法作用域向外查找，bind 也改不了。' },
      { term: 'class 体内', meaning: '始终是严格模式，方法脱离实例调用时 this 为 undefined。' },
    ],
  },
  interview: {
    answer: 'this 不由函数定义的位置决定，而由调用点决定。判定顺序是：用 new 调用时 this 是新对象；用 call、apply、bind 显式指定时 this 是传入的值；以 obj.fn() 形式调用时 this 是点号前面的对象，而且只看最后一层，a.b.c() 里 this 是 b；剩下的独立调用属于默认绑定，严格模式下是 undefined，非严格模式下会被替换成全局对象。箭头函数是例外，它根本没有自己的 this，只是沿词法作用域向外找，所以 call 和 bind 对它无效，这也正是回调里用箭头函数能保住 this 的原因。实践中最常见的坑是把方法当作回调传出去，引用被摘下来后就只剩默认绑定了，解决办法是 bind、箭头函数包一层，或者用 class 字段写成箭头函数属性。另外 class 体内始终是严格模式，所以脱离实例调用得到的是 undefined 而不是全局对象，报错反而更早更清楚。',
    followUps: [
      '箭头函数的 this 为什么不能被 call 或 bind 改变？',
      'class 方法写成普通方法和写成箭头函数字段，各有什么代价？',
      'DOM 事件处理器里的 this 是什么，与 event.currentTarget 的关系？',
    ],
  },
};
