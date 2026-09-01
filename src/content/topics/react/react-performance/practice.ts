import type { TopicPractice } from '../../../types';

export const practice: TopicPractice = {
  slug: 'react-performance',
  code: {
    input: '给一个纯展示子组件包上 `React.memo`，父组件每次渲染都传入一个新建的对象字面量作为 prop，观察子组件是否仍然重渲染。',
    output: 'memo 做的是浅比较，新建的对象每次引用都不同，因此优化完全失效。把对象用 useMemo 稳定，或者干脆不传对象而传原始值，memo 才会生效。这说明记忆化是一条链，任一环断了整条都白做。',
  },
  reference: {
    caption: '优化手段的选择顺序',
    rows: [
      { term: '1. 测量', meaning: '用 Profiler 找出真正耗时的提交，不要凭感觉优化。' },
      { term: '2. 状态下移', meaning: '把频繁变化的状态放到最小的子树里。' },
      { term: '3. 内容提升', meaning: '用 children 把不变的子树作为 prop 传入，天然跳过重渲染。' },
      { term: '4. 记忆化', meaning: 'memo 加 useMemo 加 useCallback，必须整条链都稳定才有效。' },
      { term: '5. 虚拟化', meaning: '长列表只渲染可视区域，收益远大于任何记忆化。' },
      { term: '6. 并发特性', meaning: 'useTransition 与 useDeferredValue 让紧急更新优先。' },
    ],
  },
  interview: {
    answer: '我的顺序是先测量再优化。用 React DevTools 的 Profiler 看哪一次提交耗时长、哪些组件在渲染以及为什么渲染，再决定手段。第一优先是结构调整而不是加 memo：把频繁变化的状态下移到真正用到它的子树，或者把不变的部分通过 children 作为 prop 传进来，这样父组件重渲染时那部分元素引用没变，React 会直接跳过。第二才是记忆化，React.memo 做的是 props 浅比较，useMemo 缓存计算结果，useCallback 稳定函数引用；关键在于它们是一条链，只要有一环传了每次新建的对象或内联函数，整条优化就失效，所以到处加 memo 往往只增加成本不带来收益。第三是针对具体问题的手段：长列表用虚拟滚动，收益比任何记忆化都大；大计算搬到 Web Worker；输入卡顿用 useDeferredValue 或 useTransition 把非紧急更新降级，让输入保持响应。最后要记住重渲染本身不等于慢，React 渲染纯 JS 对象很快，真正的成本在提交阶段的 DOM 操作、同步布局读取和昂贵的子组件计算上。',
    followUps: [
      '为什么给组件包了 React.memo 却没有生效？',
      'useMemo 和 useCallback 的成本是什么，什么时候不该用？',
      'useTransition 和 useDeferredValue 分别解决什么问题？',
    ],
  },
};
