import type { TopicPractice } from '../../../types';

export const practice: TopicPractice = {
  slug: 'type-narrowing',
  code: {
    input: '把 `fetch` 的响应体先当作 `unknown`，交给真实检查字段的 `isUser` 谓词，再对 `RequestState` 联合做 switch 并在 default 调用 `assertNever`。',
    output: '`as User` 版本编译通过但运行时在 `toUpperCase` 崩溃；谓词版本在边界处抛出可定位的校验错误。给联合新增 `cancelled` 分支而不处理时，`assertNever(state)` 直接产生编译错误。',
  },
  reference: {
    caption: 'TypeScript 收窄工具速查',
    rows: [
      { term: 'typeof / instanceof', meaning: '依据运行时类型信息收窄。' },
      { term: '可辨识联合', meaning: '用共同字段表达有限状态。' },
      { term: 'never', meaning: '在分支末尾执行穷尽检查。' },
      { term: 'unknown vs any', meaning: 'unknown 强制先证明再使用；any 关闭检查。' },
    ],
  },
  interview: {
    answer: '类型收窄是 TypeScript 根据控制流和运行时判断，把较宽类型缩小到当前分支可安全使用的类型。外部输入应先用 unknown 承接，再通过 typeof、in、instanceof 或经过验证的自定义谓词收窄；any 会绕过检查，as 断言也只改变编译器看法，不能验证 API 响应。业务状态适合建模为带共同判别字段的可辨识联合，switch 后把剩余值交给接收 never 的 assertNever，这样新增分支时编译器会指出遗漏。边界处运行时校验、内部精确联合和穷尽检查结合起来，才能让类型反映真实数据。',
    followUps: [
      'unknown 为什么比 any 更适合表示 API 响应？',
      '自定义类型谓词写错会带来什么风险？',
      '如何用 never 让新增联合成员触发编译错误？',
    ],
  },
};
