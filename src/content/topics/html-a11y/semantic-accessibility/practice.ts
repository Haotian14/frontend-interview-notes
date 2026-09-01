import type { TopicPractice } from '../../../types';

export const practice: TopicPractice = {
  slug: 'semantic-accessibility',
  code: {
    input: '把一个 `<div role="button" onclick>` 和一个原生 `<button>` 并排放进页面，用 Tab 键和屏幕阅读器依次访问。',
    output: '原生 button 可聚焦、能被空格/回车触发、在可访问性树里带有正确角色与状态；div 版本需要手动补 tabindex 与键盘事件，缺一项就无法用键盘操作。',
  },
  reference: {
    caption: '可访问名称来源优先级',
    rows: [
      { term: 'aria-labelledby', meaning: '优先级最高，引用页面上已有的可见文本。' },
      { term: 'aria-label', meaning: '覆盖内容文本；不可见，容易与界面漂移。' },
      { term: '元素内容 / label', meaning: '默认来源，最不容易失真。' },
      { term: 'aria-describedby', meaning: '补充描述（如表单错误），不替代名称。' },
    ],
  },
  interview: {
    answer: '我会先选有正确语义和交互行为的原生 HTML，因为 button、label、input 等元素已经向可访问性树暴露名称、角色和状态，并提供键盘及焦点行为。只有原生元素无法表达组件语义时才使用 ARIA，而且 ARIA 只补充语义，不会自动实现事件、焦点管理或键盘交互。验证时我会检查可访问名称是否稳定、角色与状态是否准确、Tab 焦点顺序是否符合视觉和阅读顺序、表单错误是否通过 aria-describedby 与控件关联，并用键盘、屏幕阅读器、200% 缩放和自动化检查共同测试。',
    followUps: [
      '为什么给 div 添加 role="button" 仍然不等于原生 button？',
      'aria-label、aria-labelledby 和可见文本应该如何选择？',
      '动态表单错误应如何关联并在合适时机播报？',
    ],
  },
};
