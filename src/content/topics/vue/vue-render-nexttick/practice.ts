import type { TopicPractice } from '../../../types';

export const practice: TopicPractice = {
  slug: 'vue-render-nexttick',
  code: {
    input: '在一次同步点击事件中连续三次修改同一个 ref，修改后立刻读取 DOM 文本，再 await nextTick 后读取一次。',
    output: '同步阶段读到旧 DOM；三次修改被去重为一次组件更新。await nextTick 后能读到这一批 Vue DOM patch 完成后的文本。',
  },
  reference: {
    caption: 'Vue 更新时机速查',
    rows: [
      { term: '同步修改状态', meaning: '响应式值立即变化，但 DOM 默认不会同步重绘。' },
      { term: '默认 watcher', meaning: '在父组件更新后、所属组件 DOM 更新前执行。' },
      { term: 'flush: post', meaning: '在所属组件 DOM 更新后执行，适合读取更新后的 DOM。' },
      { term: 'flush: sync', meaning: '立即执行且不批处理，只应用于极少量简单状态。' },
      { term: 'nextTick', meaning: '等待当前这批 Vue 更新队列完成，不等图片加载和后续网络请求。' },
    ],
  },
  interview: {
    answer: 'Vue 修改响应式状态后不会立刻同步修改 DOM，而是把组件更新任务放进调度队列，并在微任务阶段批量刷新。同一个组件在一轮同步代码里被触发多次，任务会按身份去重，所以连续修改三次状态通常只 patch 一次 DOM。这既避免了中间状态的无效渲染，也保证父组件和子组件按照稳定顺序更新。nextTick 返回的是当前刷新 Promise，await 它表示这一批 Vue 调度的 DOM 更新已经完成，因此适合更新状态后读取尺寸或聚焦元素。但它不保证浏览器已经完成一次视觉绘制，也不会等待图片、字体和接口请求；需要等待实际绘制时还要配合 requestAnimationFrame。watch 的 flush 决定副作用时机：默认 pre 在组件 DOM 更新前，post 在更新后，sync 则跳过批处理立即执行，后者很容易在高频修改中造成性能问题。',
    followUps: [
      '为什么连续修改多次状态通常只触发一次组件更新？',
      'nextTick 与 requestAnimationFrame 分别等待什么？',
      'watch 的 pre、post 和 sync 应该如何选择？',
    ],
  },
};
