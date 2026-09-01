import type { TopicPractice } from '../../../types';

export const practice: TopicPractice = {
  slug: 'composition-composables',
  code: {
    input: '实现 useEventListener(target, type, listener)，在组件挂载时绑定、卸载时解绑，并让 target 支持 ref。反复挂载和卸载组件后检查监听器数量。',
    output: '每次挂载只有一个监听器，卸载后归零；target 改变时旧目标被解绑、新目标被绑定，不会出现重复回调和悬空引用。',
  },
  reference: {
    caption: 'Composable 设计检查表',
    rows: [
      { term: '输入', meaning: '接受普通值、ref 或 getter 时明确是否用 toValue 归一化。' },
      { term: '输出', meaning: '返回 ref 和明确动作，避免泄露内部可变对象。' },
      { term: '副作用', meaning: '事件、定时器、请求和订阅必须注册对应清理。' },
      { term: '生命周期', meaning: '需要组件上下文的 API 必须在 setup 同步阶段调用。' },
      { term: '并发', meaning: '请求型 composable 要处理取消、过期响应和重试边界。' },
      { term: '测试', meaning: '将纯逻辑与生命周期外壳分开，便于单元测试。' },
    ],
  },
  interview: {
    answer: 'Composition API 的核心价值不是把 Options API 换一种写法，而是让状态、派生值、副作用和清理按业务能力聚合。一个好的 composable 应当有明确输入输出：输入如果允许普通值、ref 和 getter，要先统一读取方式；输出优先返回只需要公开的 ref 和动作，不把内部实现全部暴露出去。更重要的是管理副作用生命周期，事件监听、定时器、Observer、订阅和请求都必须在失效或卸载时清理，请求还要防止旧响应覆盖新状态。相比 mixin，composable 的数据来源显式、命名由调用方控制、依赖关系能被 TypeScript 推导，也可以嵌套组合。它与 React Hook 的目标相似，但约束不同：Vue 依赖响应式追踪，不靠调用顺序识别状态槽；不过需要组件上下文的生命周期 API 仍必须在 setup 的同步阶段调用。跨多个组件共享同一份可变状态时，我会先判断是否应该提升为 store，而不是在模块顶层随意创建单例。',
    followUps: [
      'Composable 与 mixin 相比解决了哪些具体问题？',
      '请求型 composable 如何避免旧响应覆盖新结果？',
      '什么时候应该使用 composable，什么时候应该使用 Pinia？',
    ],
  },
};
