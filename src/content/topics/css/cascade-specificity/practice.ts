import type { TopicPractice } from '../../../types';

export const practice: TopicPractice = {
  slug: 'cascade-specificity',
  code: {
    input: '写三条规则：`.card p`、`:where(.card) p` 和 `p`，都设置 `color`，观察哪一条生效。',
    output: '`:where()` 的优先级恒为零，所以 `:where(.card) p` 只相当于 `p`，被 `.card p` 覆盖，也会被同样是零权重但更靠后的规则覆盖；`:is()` 则取参数里最高的一项。这说明选择器写法本身就是优先级设计，不必靠加类名堆权重。',
  },
  reference: {
    caption: '层叠比较顺序（先比前者，分不出再看后者）',
    rows: [
      { term: '1. 来源与重要性', meaning: '用户代理 → 用户 → 作者，!important 时三者顺序整体反转。' },
      { term: '2. 层叠层（@layer）', meaning: '后声明的层胜出；!important 时层顺序反转。' },
      { term: '3. 作用域接近度', meaning: '@scope 下，作用域根离元素更近的规则胜出。' },
      { term: '4. 优先级', meaning: '按 (ID, 类/属性/伪类, 元素/伪元素) 三元组逐位比较。' },
      { term: '5. 出现顺序', meaning: '完全相同则后出现的胜出。' },
    ],
  },
  interview: {
    answer: '一个属性最终取哪个值，是层叠算法一步步筛出来的，优先级只是其中一环。顺序是：先比来源与重要性，作者的普通声明高于用户和用户代理，但带 important 时这个顺序整体反转，所以用户的 important 样式最高，这是无障碍设计的保障；再比层叠层，后声明的层赢，important 时层顺序同样反转；然后是作用域接近度；接着才是优先级，按 ID、类与属性与伪类、元素与伪元素三组计数从左到右比较，不进位，所以再多的类也压不过一个 ID；最后才是出现顺序。内联样式相当于更高一档来源。继承是另一回事，它只在某个元素上没有任何声明命中时才发生，而且只有部分属性可继承。工程上我用 @layer 把重置、第三方、组件、工具类分层，用 :where 把基础样式写成零优先级，这样覆盖靠层次而不是靠加权重或 important。',
    followUps: [
      '为什么 !important 会让来源顺序反转？',
      ':is() 和 :where() 对优先级的影响有什么区别？',
      '继承和层叠的关系是什么，unset 和 revert 分别做什么？',
    ],
  },
};
