# React Core Check（wk0 day2 / wk1 day1）

> 用法：每个点包含 3 样东西：
>
> 1. ✅🟡🔴 2) 面试一句话解释 3) 最小例子/关键词  
>    ✅ 讲得清 + 写得出；🟡 讲得清但写不顺/容易错；🔴 不清楚或没做过。

---

## 0. 现状标记

- 今日日期：2026-01-14
- 当前自评：🔴（整体）
- 本次目标：把每一项都补上“面试一句话 + 最小例子/关键词”，每天把 🔴→🟡→✅

---

## 1) 组件与渲染机制（必会）

- React 渲染是什么（render 的含义）：🔴

  - 一句话：render 是“根据 state/props 计算 UI 描述”，React 会对比前后虚拟树并把差异更新到 DOM。
  - 关键词：声明式、reconciliation、diff

- rerender 触发条件：🔴

  - 一句话：state 更新、props 变化、context 变化、父组件 rerender 都可能导致子组件 rerender（即使 DOM 不一定变）。
  - 关键词：state/props/context、父子传递

- setState/useState 更新是异步吗：🔴

  - 一句话：React 会批处理更新（batching），你不能依赖 setState 之后立刻读到新值；用函数式更新最安全。
  - 关键词：batching、functional update

  ```tsx
  setCount((c) => c + 1);
  ```

- React 18 并发/批处理（了解）：🔴

  - 一句话：React 18 默认更多场景会自动批处理更新，减少渲染次数（提升性能）。
  - 关键词：automatic batching、concurrent features

- StrictMode（开发模式双调用）原因：🔴

  - 一句话：开发环境 StrictMode 可能让某些生命周期/Effect 执行两次，用于暴露副作用问题。
  - 关键词：dev-only、double invoke

---

## 2) Props / State / Key（高频）

- props 与 state 区别：🔴

  - 一句话：props 是外部传入只读数据；state 是组件内部可变状态，更新会触发 rerender。
  - 关键词：单向数据流

- key 的作用：🔴

  - 一句话：key 用于帮助 React 在列表 diff 中识别元素身份，避免错误复用与提升性能。
  - 关键词：identity、稳定唯一、不要用 index（除非静态列表）

  ```tsx
  items.map((item) => <li key={item.id}>{item.name}</li>);
  ```

- 受控 vs 非受控组件：🔴

  - 一句话：受控组件由 state 控制输入值；非受控通过 ref/DOM 自己管理值。
  - 关键词：value/onChange、ref

  ```tsx
  const [v,setV]=useState("")
  <input value={v} onChange={e=>setV(e.target.value)} />
  ```

---

## 3) Hooks 基础（必会）

- useState：🔴

  - 一句话：管理组件局部状态；更新触发 rerender；推荐函数式更新避免闭包旧值。
  - 关键词：状态、批处理

  ```tsx
  setCount((c) => c + 1);
  ```

- useEffect：🔴

  - 一句话：处理副作用（请求、订阅、手动 DOM）；依赖数组决定何时执行；返回 cleanup 做清理。
  - 关键词：依赖数组、cleanup、避免无限循环

  ```tsx
  useEffect(() => {
    const id = setInterval(() => {}, 1000);
    return () => clearInterval(id);
  }, []);
  ```

- useRef：🔴

  - 一句话：保存跨渲染不变的可变值（不会触发 rerender），也可拿 DOM 引用。
  - 关键词：mutable、DOM ref

  ```tsx
  const ref = useRef<HTMLDivElement | null>(null);
  ```

- useMemo：🔴

  - 一句话：缓存“计算结果”，用于昂贵计算或保持引用稳定（依赖不变时复用）。
  - 关键词：memoize value、性能优化

  ```tsx
  const filtered = useMemo(() => heavy(list), [list]);
  ```

- useCallback：🔴

  - 一句话：缓存“函数引用”，避免子组件因为函数引用变化而重复渲染。
  - 关键词：memoize function、配合 React.memo

  ```tsx
  const onClick = useCallback(() => {}, [dep]);
  ```

- 自定义 Hook：🔴

  - 一句话：把可复用逻辑抽成 Hook（以 use 开头），本质是组合已有 Hooks。
  - 关键词：逻辑复用、组合

  ```tsx
  function useToggle() {
    const [v, setV] = useState(false);
    return [v, () => setV((x) => !x)] as const;
  }
  ```

- Hooks 规则：🔴

  - 一句话：只能在组件顶层调用 Hook，不能在条件/循环里调用，保证调用顺序一致。
  - 关键词：Rules of Hooks、lint plugin

---

## 4) Effect 常见坑（面试超爱问）

- 依赖数组为什么重要：🔴

  - 一句话：依赖数组决定 Effect 的重新执行时机，漏依赖会产生“旧闭包”，多依赖可能导致频繁执行。
  - 关键词：stale closure、exhaustive-deps

- 请求放 useEffect 怎么写：🔴

  - 一句话：在 Effect 里发请求；处理 loading/error；必要时取消/忽略过期结果避免竞态。
  - 关键词：race condition、abort、ignore flag

  ```tsx
  useEffect(() => {
    let alive = true;
    fetch("/api")
      .then((r) => r.json())
      .then((data) => {
        if (alive) setData(data);
      });
    return () => {
      alive = false;
    };
  }, []);
  ```

- cleanup 何时执行：🔴

  - 一句话：组件卸载时执行，或依赖变化导致 Effect 重新运行前先执行上一次的 cleanup。
  - 关键词：unsubscribe、clear timer

---

## 5) 性能优化（需要会讲清楚）

- React.memo：🔴

  - 一句话：对函数组件做浅比较 props，props 不变时跳过 rerender（适合纯展示组件）。
  - 关键词：shallow compare、props stable

- useMemo/useCallback 何时用：🔴

  - 一句话：只有在“确实存在性能问题/引用稳定需求”时用，滥用会增加复杂度且未必更快。
  - 关键词：过度优化、依赖正确性

- 避免无意义 rerender 的常见做法：🔴

  - 一句话：拆分组件、提升 state（或下放 state）、保持 props 引用稳定、列表 key 稳定。
  - 关键词：component split、state colocation

- 列表渲染性能：🔴

  - 一句话：长列表用虚拟滚动（react-window 等），避免一次渲染太多 DOM。
  - 关键词：virtualization

---

## 6) Context 与状态管理（必会一点）

- Context 解决什么问题：🔴

  - 一句话：解决跨层级 props drilling（如主题/语言/用户信息），但不等于“全局状态管理银弹”。
  - 关键词：Provider/Consumer、避免滥用

- Context 导致性能问题的原因：🔴

  - 一句话：Context value 改变会让订阅它的组件 rerender，value 引用不稳定会造成额外渲染。
  - 关键词：value memo、拆分 context

  ```tsx
  const value = useMemo(() => ({ user }), [user]);
  ```

---

## 7) 表单与事件（前端高频）

- React 事件系统：🔴

  - 一句话：React 使用合成事件（SyntheticEvent）做跨浏览器封装，事件处理通常挂在根节点做委托。
  - 关键词：事件委托、SyntheticEvent

- setState 连续调用为什么要函数式更新：🔴

  - 一句话：因为更新被批处理，直接用旧值可能丢更新；函数式更新基于最新 state。
  - 关键词：batching、避免丢失

  ```tsx
  setCount((c) => c + 1);
  setCount((c) => c + 1);
  ```

---

## 8) 组件通信（会写会讲）

- 父传子 / 子传父：🔴

  - 一句话：父传子用 props；子传父用回调函数 props。
  - 关键词：callback props

- 兄弟组件通信：🔴

  - 一句话：把共享 state 提升到最近共同父组件（lifting state up），或用 context/全局状态。
  - 关键词：lift state up

---

## 9) React Router（了解即可，面试常见）

- SPA 路由原理：🔴

  - 一句话：通过 History API（pushState/replaceState）改变 URL 而不刷新页面，路由组件根据路径切换渲染。
  - 关键词：history、client-side routing

- 路由懒加载：🔴

  - 一句话：配合 React.lazy + Suspense 或路由级 code splitting，提升首屏性能。
  - 关键词：lazy、Suspense、chunk

---

## 10) 你项目里常见的工程点（加分）

- 为什么需要 key、memo、拆分组件：🔴

  - 一句话：它们都是为了减少不必要渲染与错误复用，核心是“稳定身份 + 稳定引用”。
  - 关键词：identity/reference stability

- 常见 bug：依赖数组写错：🔴

  - 一句话：漏依赖导致旧闭包；乱加依赖导致频繁请求/死循环，必要时把逻辑搬进 Effect 或用 useCallback 固定引用。
  - 关键词：stale closure、infinite loop

---

## 11) 今日红黄清单（用于明天计划）

- 🔴 TOP3：
  1.
  2.
  3.
- 🟡 TOP3：
  1.
  2.
  3.

---

## 12) 备注（自己的坑/易错点）

-
