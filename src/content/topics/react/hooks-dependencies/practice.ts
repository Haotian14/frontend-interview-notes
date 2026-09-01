import type { TopicPractice } from '../../../types';

export const practice: TopicPractice = {
  slug: 'hooks-dependencies',
  code: {
    input: '写一个 `useEffect(() => { const id = setInterval(() => setCount(count + 1), 1000); return () => clearInterval(id); }, [])`，观察计数停在哪里；再换成函数式更新 `setCount(c => c + 1)`。',
    output: '空依赖数组让 effect 只在挂载时运行一次，回调闭包捕获的 count 永远是 0，所以计数停在 1；用函数式更新后不再依赖闭包里的旧值，计数正常。这说明依赖数组不是性能开关，而是在声明"这个 effect 用到了哪些外部值"。',
  },
  reference: {
    caption: 'effect 相关判断',
    rows: [
      { term: '依赖数组的含义', meaning: '声明 effect 用到的所有响应式值，不是优化选项。' },
      { term: '空数组 []', meaning: '只在挂载时运行，回调内的 props 与 state 永远是首次的值。' },
      { term: '省略数组', meaning: '每次渲染后都运行，通常是 bug 而不是意图。' },
      { term: '清理函数', meaning: '在下次运行前和卸载时执行，用于取消订阅、中止请求。' },
      { term: 'useLayoutEffect', meaning: '在浏览器绘制前同步执行，只用于测量与避免闪烁。' },
      { term: 'useSyncExternalStore', meaning: '订阅外部数据源的正确方式，兼容并发渲染。' },
    ],
  },
  interview: {
    answer: 'Hooks 的两条规则来自实现方式：React 用调用顺序而不是名字把每次渲染的 Hook 与内部链表对应起来，所以必须在组件或自定义 Hook 的顶层无条件调用，条件、循环、提前 return 都会让顺序错位。依赖数组的正确读法是"这个 effect 用到了哪些来自渲染的值"，它是一份声明而不是性能开关；漏写会导致闭包捕获旧值，也就是所谓的闭包陷阱，多写会让 effect 频繁重跑。想减少依赖不是删数组项，而是改结构：用函数式更新避免依赖当前 state，把不随渲染变化的对象移到组件外，或者用 useCallback 稳定函数引用。更重要的判断是这个 effect 该不该存在。React 官方的立场是 effect 只用于同步外部系统，比如订阅、DOM 操作、网络请求；能由 props 和 state 直接算出来的数据应该在渲染中计算，事件驱动的逻辑应该写在事件处理器里，用 effect 去同步派生状态会多一次渲染并制造难以追踪的连锁更新。最后 StrictMode 在开发环境会额外挂载卸载一次，这不是 bug 而是用来暴露缺失的清理函数。',
    followUps: [
      '为什么 Hooks 不能写在条件语句里？',
      '依赖数组漏写会发生什么，怎么正确地减少依赖？',
      '哪些逻辑不应该放进 useEffect？',
    ],
  },
};
