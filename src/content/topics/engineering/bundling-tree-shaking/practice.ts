import type { TopicPractice } from '../../../types';

export const practice: TopicPractice = {
  slug: 'bundling-tree-shaking',
  code: {
    input: '从一个工具库里只导入一个函数，构建后用产物分析插件查看该库贡献的体积；再把导入方式换成默认导入整个命名空间对比。',
    output: '具名导入且库是 ESM、并正确标注了 sideEffects 时，未使用的导出会被删掉，体积只增加所用函数的部分；换成命名空间导入或库只有 CommonJS 产物时，整个库都会被打进产物。这说明 Tree Shaking 是打包器、模块格式和库作者三方共同决定的结果。',
  },
  reference: {
    caption: 'Tree Shaking 的前置条件',
    rows: [
      { term: '静态可分析的模块格式', meaning: '必须是 ESM，CommonJS 的 require 无法静态判定。' },
      { term: '具名导入', meaning: '命名空间导入会让整个模块被保留。' },
      { term: 'sideEffects 声明', meaning: 'package.json 中标注为 false 或列出确有副作用的文件。' },
      { term: '无顶层副作用', meaning: '模块顶层修改全局、注册原型的代码无法安全删除。' },
      { term: '生产模式构建', meaning: '开发构建不做压缩与死代码消除，体积不具参考性。' },
      { term: '类与方法的粒度', meaning: '类的未用方法通常删不掉，函数导出的粒度更好。' },
    ],
  },
  interview: {
    answer: '打包器做的事是从入口出发解析依赖图，把模块转换、合并、压缩成少量产物，并按配置切分出 chunk。Tree Shaking 是其中的死代码消除步骤，它能生效需要三方配合。第一是模块格式必须是 ESM，因为 import 和 export 是静态语法，打包器不执行代码就能建立引用关系；CommonJS 的 require 是运行时表达式，只能保守保留。第二是导入方式，具名导入才能精确到导出粒度，命名空间导入等于用到了整个模块。第三是副作用声明，打包器无法确定模块顶层的代码有没有外部影响，所以库要在 package.json 里写 sideEffects，标为 false 表示可以放心删，或者列出确实有副作用的文件，比如样式和 polyfill；标错会导致必要代码被删掉，产生线上 bug。实践中我会用产物分析工具看每个依赖贡献了多少体积，重点排查那些只用了一个函数却打进来几十 KB 的库，通常原因是它只发布了 CommonJS 产物或者内部有顶层副作用，这时候换库或者按子路径导入更有效。还要注意开发构建不做压缩，体积必须以生产构建为准。',
    followUps: [
      'Tree Shaking 为什么依赖 ESM？',
      'sideEffects 标错会有什么后果？',
      '为什么只导入一个函数还是打进来整个库？',
    ],
  },
};
