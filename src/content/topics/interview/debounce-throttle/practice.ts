import type { TopicPractice } from '../../../types';

export const practice: TopicPractice = {
  slug: 'debounce-throttle',
  code: {
    input: '给同一个输入框分别绑定 300ms 防抖和 300ms 节流的回调，然后连续快速敲 10 个字符，记录回调实际触发的次数与时刻。',
    output: '防抖只在最后一次输入后 300ms 触发 1 次；节流在这 10 次输入期间按固定间隔触发约 3~4 次。停止输入后防抖有一次尾调用，节流是否还有取决于是否启用 trailing。',
  },
  reference: {
    caption: '防抖与节流选择速查',
    rows: [
      { term: '防抖 debounce', meaning: '只关心最终状态；连续触发期间不执行。' },
      { term: '节流 throttle', meaning: '需要过程反馈；按固定频率执行。' },
      { term: 'leading', meaning: '首次触发立即执行，适合按钮防重复。' },
      { term: 'trailing', meaning: '停止后补一次，确保最终值不丢失。' },
      { term: 'rAF 节流', meaning: '与渲染帧对齐，适合滚动视差等视觉更新。' },
    ],
  },
  interview: {
    answer: '两者都用来削减高频事件的回调次数，但语义不同：防抖是"等安静"——每次触发都重置计时器，只有在停止触发满 N 毫秒后才执行一次，适合搜索联想、表单校验这种只关心最终状态的场景；节流是"限频率"——保证单位时间内最多执行一次，适合滚动位置上报、拖拽这种需要过程反馈的场景。实现上都靠闭包保存定时器句柄或上次执行时间，注意三点：用剩余时间而不是固定间隔来判断节流是否该执行，保留 this 和参数以便作为方法使用，以及必须提供 cancel 让组件卸载时能清理定时器，否则会造成内存泄漏和卸载后 setState。做视觉更新时优先用 requestAnimationFrame 节流，它天然与渲染帧对齐，不会在一帧内做无谓的重复计算。',
    followUps: [
      '为什么防抖实现里必须保留 this 和参数？',
      '节流的 leading 与 trailing 组合会带来什么差异？',
      '什么时候应该用 requestAnimationFrame 而不是定时器节流？',
      '不提供 cancel 会在 React 组件里造成什么问题？',
    ],
  },
};
