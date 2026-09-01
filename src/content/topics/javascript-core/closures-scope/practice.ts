import type { TopicPractice } from '../../../types';

export const practice: TopicPractice = {
  slug: 'closures-scope',
  code: {
    input: '在 `for` 循环里分别用 `var` 和 `let` 声明计数变量，并在每轮排入一个读取该变量的 `setTimeout` 回调。',
    output: '`var` 版本三个回调打印同一个终值 3（共享一个函数级绑定）；`let` 版本打印 0、1、2（每轮迭代各有独立绑定）。',
  },
  reference: {
    caption: '声明形式与作用域速查',
    rows: [
      { term: 'var', meaning: '函数作用域；提升并初始化为 undefined。' },
      { term: 'let / const', meaning: '块作用域；提升但未初始化，进入 TDZ。' },
      { term: '函数声明', meaning: '整体提升，可在声明前调用。' },
      { term: '循环中的 let', meaning: '每轮迭代创建新绑定，是闭包能拿到各自值的原因。' },
    ],
  },
  interview: {
    answer: 'JavaScript 使用词法作用域：标识符解析看代码写在哪里，而不是函数被谁调用。函数创建时会记住自己所处的词法环境，这个引用让内部函数在外层函数返回之后仍能访问外层变量，这就是闭包。闭包保存的是变量绑定本身而不是当时的值副本，所以循环里用 var 的回调会共享同一个绑定并读到终值，用 let 则因为每轮迭代产生新绑定而各自独立。代价是被闭包引用的环境无法被回收，长期存活的回调、事件监听和缓存如果闭包住大对象就会把它们一起留住，所以要在不需要时解绑并避免捕获超出需要的变量。',
    followUps: [
      '闭包保存的是值还是绑定？循环里的差异说明了什么？',
      '什么情况下闭包会造成内存无法回收？',
      'let 的暂时性死区和 var 的提升在行为上有什么不同？',
    ],
  },
};
