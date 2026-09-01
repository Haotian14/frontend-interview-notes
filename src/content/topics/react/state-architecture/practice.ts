import type { TopicPractice } from '../../../types';

export const practice: TopicPractice = {
  slug: 'state-architecture',
  code: {
    input: '把 `{ user, theme, toggleTheme }` 放进同一个 Context 的对象值里，在只消费 theme 的组件上加日志，然后只更新 user。',
    output: '只消费 theme 的组件同样被重渲染，因为 Context 的比较是对整个 value 做引用比较，且消费者无法只订阅其中一部分。把不同变化频率的状态拆成多个 Context，或者改用带选择器的外部 store，才能真正隔离。',
  },
  reference: {
    caption: '按状态类型选择存放位置',
    rows: [
      { term: '服务端数据', meaning: '本质是缓存，交给数据请求库管理失效与重取，不要手动放进全局 store。' },
      { term: '可分享或可刷新的状态', meaning: '筛选、分页、标签页放进 URL 查询参数。' },
      { term: '跨远距离组件的共享状态', meaning: '用 Context 传递身份、主题、语言这类低频变化的值。' },
      { term: '兄弟组件间的状态', meaning: '提升到最近公共父组件即可，不需要全局方案。' },
      { term: '组件内部状态', meaning: '默认放 useState，能局部就不要上移。' },
      { term: '不影响渲染的值', meaning: '用 useRef，例如定时器 id、上一次的值。' },
    ],
  },
  interview: {
    answer: '我不会先问用哪个状态管理库，而是先把状态按来源分类。第一类是服务端数据，它本质上是远端数据的缓存，需要的是请求去重、失效、重取和竞态处理，应该交给 TanStack Query 这类数据层，把它塞进全局 store 手动同步是大多数状态混乱的根源。第二类是可分享可刷新的界面状态，比如筛选条件、分页、当前标签，应该放进 URL，这样刷新和分享都不丢。第三类是真正的客户端共享状态，比如登录信息、主题、购物车草稿，这才需要 Context 或状态库。第四类是局部状态，默认用 useState，只有当兄弟组件需要协作时才提升到最近公共父组件。关于 Context 有两点要说清楚：它是依赖注入而不是状态管理，本身不提供更新优化；消费者订阅的是整个 value，任何变化都会让所有消费者重渲染，所以要按变化频率拆分 Context，并且用 useMemo 稳定 value。需要细粒度订阅时用带选择器的外部 store 配合 useSyncExternalStore 更合适。',
    followUps: [
      '为什么说服务端数据不应该放进全局 store？',
      'Context 的性能问题出在哪里，有哪些解法？',
      '什么状态适合放进 URL？',
    ],
  },
};
