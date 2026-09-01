import type { TopicPractice } from '../../../types';

export const practice: TopicPractice = {
  slug: 'autosave-conflict-control',
  code: {
    input: '模拟保存 A 已发出但响应很慢，用户随后产生 B；让 B 先返回，再让 A 返回。分别测试并发直写与单写者队列。',
    output: '并发直写可能让旧 A 覆盖新 B；单写者队列保证 A 完成后才提交归并后的最新 B。服务端再校验 baseRevision，可把跨标签页或多端冲突转成明确的 409/412，而不是静默覆盖。',
  },
  reference: {
    caption: '自动保存策略速查',
    rows: [
      { term: '立即入队', meaning: '新建、删除等离散操作完成后立刻标记 dirty。' },
      { term: '结束时提交', meaning: '拖拽和缩放只在 pointerup 提交最终语义状态。' },
      { term: '按键防抖', meaning: '文本连续输入可短暂归并，但页面失焦和切换前要 flush。' },
      { term: '单写者', meaning: '同一文档同一客户端只允许一个保存请求在途。' },
      { term: '版本条件', meaning: '请求携带 baseRevision 或 If-Match，服务端拒绝旧基线。' },
      { term: '失败恢复', meaning: '可重试错误退避重试，未确认操作保存到 IndexedDB。' },
    ],
  },
  interview: {
    answer: '可靠的自动保存不是简单 debounce 接口。我会先把用户操作归一成语义变更：新建删除立即进入 dirty 队列，拖拽缩放只在结束时提交最终状态，连续文本输入短防抖归并。客户端采用单写者模型，同一文档只允许一个保存请求在途；请求期间的新修改继续积累，响应后再提交最新归并结果，这样旧响应不会覆盖新意图。每次请求携带 operationId 和 baseRevision，服务端以 revision 或 ETag 做乐观并发控制，基线过旧返回 409 或 412，客户端再拉取最新版本并按策略合并或要求用户选择。网络失败只对超时和 5xx 等可重试错误做指数退避，未确认操作写入 IndexedDB 以支持刷新和离线恢复。界面要区分保存中、已保存、离线待同步和冲突，而不是永远显示一个模糊的自动保存文案。',
    followUps: [
      '为什么只把保存请求串行化仍然不能解决多端冲突？',
      '拖拽和文本输入应该采用相同的防抖策略吗？',
      '哪些失败可以自动重试，哪些必须提示用户？',
      '页面关闭时为什么不能只依赖 beforeunload 发异步请求？',
    ],
  },
};
