import type { TopicPractice } from '../../../types';

export const practice: TopicPractice = {
  slug: 'pinia-state-architecture',
  code: {
    input: '从 Pinia store 直接解构 count 和 increment，在页面中展示 count 并调用 increment；然后改成 storeToRefs 解构状态。',
    output: '直接解构的 count 失去响应式连接，而 action 可以直接解构；使用 storeToRefs 后 count 保持 ref，调用 increment 时页面正常更新。',
  },
  reference: {
    caption: '状态应该放在哪里',
    rows: [
      { term: '接口列表与详情', meaning: '优先交给请求缓存层处理失效、去重和重取。' },
      { term: '筛选、分页、标签', meaning: '需要刷新和分享时放进 URL。' },
      { term: '表单输入和弹窗开关', meaning: '默认留在组件或页面局部。' },
      { term: '登录身份、权限、跨页草稿', meaning: '适合放进 Pinia，并明确初始化和清理时机。' },
      { term: '派生数据', meaning: '优先 getter 或 computed，不保存重复副本。' },
      { term: '持久化', meaning: '只保存必要字段，处理版本迁移、过期与隐私。' },
    ],
  },
  interview: {
    answer: '我不会因为项目使用 Vue 就默认把所有状态放进 Pinia。接口数据本质是远端缓存，应该由请求层负责去重、失效和重取；筛选、分页这类可分享状态放 URL；输入框、弹窗开关留在组件；只有登录身份、权限、跨页面草稿等真正的客户端共享状态才进入 store。Pinia 的 getter 负责派生值，action 封装有业务含义的变更，避免组件到处直接拼装更新流程。使用时要注意 store 是 reactive 对象，直接解构 state 和 getter 会丢失响应式，应使用 storeToRefs，而 action 可以直接解构。持久化不是默认能力，需要明确保存哪些字段、何时过期、如何做版本迁移；SSR 还要为每个请求创建独立 Pinia 实例并安全序列化初始状态，避免用户之间串数据和注入风险。store 的数量不是重点，单一真相源和清晰生命周期才是重点。',
    followUps: [
      '为什么 Pinia state 直接解构会失去响应式，action 却可以？',
      '哪些数据不应该放进 Pinia？',
      'Pinia 做持久化和 SSR 时分别有什么风险？',
    ],
  },
};
