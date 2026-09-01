import type { TopicPractice } from '../../../types';

export const practice: TopicPractice = {
  slug: 'module-systems',
  code: {
    input: '在 ESM 里导出一个 `let counter` 和一个自增函数，在另一个模块 `import` 后先打印、调用自增、再打印；用 CommonJS 写同样的结构对比。',
    output: 'ESM 的导入是对原变量的实时只读绑定，第二次打印能看到更新后的值；CommonJS 导入的是 module.exports 的一次值拷贝，基本类型不会跟着变。这解释了为什么 ESM 能静态分析而 CommonJS 不能。',
  },
  reference: {
    caption: 'ESM 与 CommonJS 的关键差异',
    rows: [
      { term: '解析时机', meaning: 'ESM 在解析阶段确定依赖图；CommonJS 在运行到 require 时才加载。' },
      { term: '绑定语义', meaning: 'ESM 是实时只读绑定；CommonJS 是导出对象的值拷贝。' },
      { term: '加载方式', meaning: 'ESM 异步解析、可顶层 await；require 同步阻塞。' },
      { term: '循环依赖', meaning: 'ESM 提前得到未初始化绑定（TDZ 报错）；CommonJS 拿到半成品对象。' },
      { term: '静态可分析', meaning: 'ESM 的导入导出是语法结构，可 Tree Shaking；CommonJS 是运行时表达式。' },
      { term: '顶层 this', meaning: 'ESM 为 undefined；CommonJS 为 module.exports。' },
    ],
  },
  interview: {
    answer: '两者最根本的差别是确定依赖的时机。ESM 的 import 和 export 是语法结构，必须出现在顶层，引擎在解析阶段就能构建完整的依赖图，然后按照解析、实例化、求值三个阶段执行；CommonJS 的 require 只是一个普通函数调用，可以写在任何位置甚至拼接路径，只有运行到那一行才知道要加载什么。由此派生出一系列差异：ESM 的导入是对原始变量的实时只读绑定，重新赋值会在所有导入方可见，而 CommonJS 拿到的是 module.exports 当时的值拷贝；ESM 的加载是异步的并支持顶层 await，require 是同步阻塞的；循环依赖时 ESM 会因为暂时性死区直接报错，CommonJS 则会拿到一个不完整的对象，问题更隐蔽。工程上最重要的推论是 Tree Shaking：只有静态可分析的 ESM 才能安全地判断哪些导出没被使用，所以库应该同时提供 ESM 产物，用 package.json 的 exports 字段区分入口，并正确标注 sideEffects，否则打包器不敢删任何东西。',
    followUps: [
      '为什么只有 ESM 能可靠地做 Tree Shaking？',
      'ESM 和 CommonJS 在循环依赖下的表现有什么不同？',
      '什么时候应该用动态 import()，它和 require 有什么区别？',
    ],
  },
};
