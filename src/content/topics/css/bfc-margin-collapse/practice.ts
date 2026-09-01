import type { TopicPractice } from '../../../types';

export const practice: TopicPractice = {
  slug: 'bfc-margin-collapse',
  code: {
    input: '父元素没有边框和内边距，子元素设置 `margin-top: 40px`，观察是父元素整体下移还是子元素在父元素内下移。',
    output: '父子外边距发生折叠，父元素整体下移 40px，子元素顶部并没有留白；给父元素加 `display: flow-root`（或 1px 边框、`padding-top`）后折叠被阻断，留白出现在父元素内部。',
  },
  reference: {
    caption: '创建 BFC 的常见方式',
    rows: [
      { term: 'display: flow-root', meaning: '专为创建 BFC 设计，没有任何副作用，首选。' },
      { term: 'overflow 非 visible', meaning: '常见但会带来裁剪与滚动条副作用。' },
      { term: 'float 非 none', meaning: '元素自身脱离普通流，一般不为此使用。' },
      { term: 'position: absolute / fixed', meaning: '同样改变定位方式，副作用大。' },
      { term: 'display: inline-block / table-cell', meaning: '会改变自身的外部显示类型。' },
      { term: 'flex / grid 项目', meaning: '本身建立独立格式化上下文，因此不参与外边距折叠。' },
    ],
  },
  interview: {
    answer: 'BFC 是块级盒参与布局的一块独立区域，它内部的布局不会影响外部，也不受外部浮动侵入。它解释了三个经典现象：一是外边距折叠只发生在同一个 BFC 里的普通流块级盒之间，所以父子之间、相邻兄弟之间的垂直外边距会合并成较大的那个；二是浮动子元素不撑开父高度，因为浮动脱离普通流，而建立 BFC 的父元素在计算高度时必须包含浮动；三是紧挨浮动的块盒会被浮动侵入形成环绕，建立 BFC 后就不会。创建方式里我首选 display: flow-root，它是专门为此设计的、没有副作用；overflow: hidden 虽然常见但会裁剪内容。补充一点：flex 和 grid 项目本身就建立独立的格式化上下文，所以现代布局里外边距折叠和清除浮动这两类问题基本消失了，用 gap 表达间距比用 margin 更可预测。',
    followUps: [
      '外边距折叠发生在哪几种情况，怎么阻断？',
      '为什么 overflow: hidden 能清除浮动，它有什么副作用？',
      '为什么 flex 容器里不会出现外边距折叠？',
    ],
  },
};
