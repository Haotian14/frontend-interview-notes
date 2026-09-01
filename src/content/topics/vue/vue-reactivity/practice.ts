import type { TopicPractice } from '../../../types';

export const practice: TopicPractice = {
  slug: 'vue-reactivity',
  code: {
    input: '创建 reactive({ count: 0 })，把 count 直接解构成局部变量，再分别修改局部变量和 state.count，观察 effect 或模板是否更新。',
    output: '局部变量只是解构时取得的普通值，修改它不会触发更新；修改 state.count 会经过 Proxy 的 set 并触发依赖。需要保持连接时使用 toRef、toRefs 或直接访问 state.count。',
  },
  reference: {
    caption: 'Vue 响应式 API 选择',
    rows: [
      { term: 'ref', meaning: '适合基本类型和可替换对象，脚本中通过 value 访问。' },
      { term: 'reactive', meaning: '适合结构稳定的对象，不能整体替换后仍期待旧引用保持连接。' },
      { term: 'computed', meaning: '有缓存的派生值，只在依赖变化后重新求值。' },
      { term: 'watch', meaning: '观察明确数据源并执行异步或命令式副作用。' },
      { term: 'watchEffect', meaning: '立即执行并自动收集同步访问到的依赖。' },
      { term: 'shallowRef', meaning: '只追踪 value 替换，适合大型不可变数据或第三方实例。' },
    ],
  },
  interview: {
    answer: 'Vue 3 的响应式核心可以概括为 track 和 trigger。reactive 用 Proxy 拦截对象的 get 与 set：某个 effect 执行时读取属性，get 会把当前 effect 记录到目标对象和属性对应的依赖集合；属性被修改时，set 再取出这组 effect 交给调度器执行。依赖通常可以理解为 WeakMap 到 Map 再到 Set 的三级结构。ref 则用带 value 访问器的对象包装值，解决基本类型无法被 Proxy 直接代理以及需要整体替换对象的问题。computed 本质是带缓存和脏标记的 effect，依赖没变就复用结果。常见边界是直接解构 reactive 属性会失去代理访问路径、整体替换 reactive 对象会断开原引用，以及同一个原对象与代理对象并不全等。工程上我通常用 ref 表达可替换状态，用 reactive 管一组结构稳定的字段，大型不可变对象或第三方实例用 shallowRef，派生值优先 computed，副作用才使用 watch。',
    followUps: [
      '为什么 reactive 属性解构后容易丢失响应式？',
      'computed 为什么能够缓存，它在什么时候重新计算？',
      'ref 和 reactive 在对象状态上应该如何选择？',
    ],
  },
};
