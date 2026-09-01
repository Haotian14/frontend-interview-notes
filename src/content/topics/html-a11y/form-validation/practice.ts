import type { TopicPractice } from '../../../types';

export const practice: TopicPractice = {
  slug: 'form-validation',
  code: {
    input: '给一个 `input[type=email][required]` 绑定 `invalid` 事件，在事件里调用 `setCustomValidity` 写中文消息，再用一个按钮触发 `form.reportValidity()`。',
    output: '空值和格式错误分别得到不同的中文提示，浏览器把焦点移到第一个非法控件；把 `novalidate` 加到 `form` 上后原生气泡消失，但 `checkValidity()` 仍返回 false——说明校验状态和提示 UI 是两件事。',
  },
  reference: {
    caption: 'ValidityState 常见标志位',
    rows: [
      { term: 'valueMissing', meaning: '声明了 required 但值为空。' },
      { term: 'typeMismatch', meaning: '值不符合 type 的语法，例如 email、url。' },
      { term: 'patternMismatch', meaning: '值不匹配 pattern 正则。' },
      { term: 'rangeUnderflow / rangeOverflow', meaning: '数值或日期越过 min / max。' },
      { term: 'tooShort / tooLong', meaning: '长度不满足 minlength / maxlength，且是用户输入的值。' },
      { term: 'customError', meaning: '被 setCustomValidity 写入了非空消息。' },
    ],
  },
  interview: {
    answer: '原生表单先给我三样东西：语义、行为和校验。语义指 label 与控件的显式关联、fieldset/legend 的分组、autocomplete 和 inputmode 带来的自动填充与合适键盘；行为指回车提交、重置、以及提交时收集 name 值；校验指 required、type、pattern、min/max/step 等约束，它们汇总成每个控件的 ValidityState。我一般保留原生校验作为状态来源，用 checkValidity 或 validity 读状态，用 setCustomValidity 写业务消息，只把提示 UI 换成自己的组件，因为原生气泡不能样式化、不能同时显示多条、移动端表现也不一致。渲染错误时要把消息节点用 aria-describedby 关联到控件，并设置 aria-invalid，让屏幕阅读器读得到。最后，客户端校验只是体验优化，服务端必须重复校验，因为请求可以被直接构造。',
    followUps: [
      'checkValidity、reportValidity 和 novalidate 三者的关系是什么？',
      '自定义错误提示时怎么保证屏幕阅读器能读到？',
      '为什么客户端校验不能替代服务端校验？',
    ],
  },
};
