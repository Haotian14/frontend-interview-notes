import type { TopicPractice } from '../../../types';

export const practice: TopicPractice = {
  slug: 'concurrency-pool',
  code: {
    input: '准备 8 个耗时不同的异步任务，调用 mapLimit(tasks, 3, worker)，记录任意时刻的 active 数量和最终结果数组。',
    output: 'active 从不超过 3；完成顺序可以不同，但结果仍按输入索引排列。某任务失败时根据约定选择立即 reject，或返回对应索引的 fulfilled/rejected 结果。',
  },
  reference: {
    caption: '并发池设计决策',
    rows: [
      { term: '并发上限', meaning: '同时执行中的任务数量，不是每秒请求次数。' },
      { term: '结果顺序', meaning: '通过捕获输入索引写回固定数组，与完成顺序解耦。' },
      { term: '失败即停', meaning: '外层尽快 reject，但已启动任务需要 AbortSignal 才能真正停止。' },
      { term: '收集全部', meaning: '每项包装成状态对象，适合批量上传和批处理结果页。' },
      { term: '重试', meaning: '应占用同一 worker 槽位，并限制次数和退避。' },
      { term: '速率限制', meaning: '需要时间窗口或令牌桶，不能仅靠并发池实现。' },
    ],
  },
  interview: {
    answer: '实现并发池最简单稳定的方式是启动 min(limit, tasks.length) 个 worker，共享一个只递增的 cursor。每个 worker 循环领取下一个索引，await 任务后把结果写回该索引，这样同时在途数量不超过 limit，而结果仍保持输入顺序。开始前校验 limit 是正整数，并把 task 设计成函数而不是已经创建的 Promise，因为 Promise 创建时任务往往已经开始，池就无法限制启动。失败策略必须提前约定：fail-fast 可以让外层尽快 reject，但已经启动的请求不会自动取消，需要共享 AbortController；批量上传更适合收集每项 fulfilled 或 rejected。并发限制与速率限制不同，前者控制同时在途数量，后者控制时间窗口内的启动频率，需要令牌桶等额外机制。',
    followUps: [
      '为什么并发池应该接收任务函数而不是 Promise 数组？',
      '怎样保证完成顺序不同但结果顺序不变？',
      '外层 reject 后已经运行的任务会停止吗？',
      '并发限制与每秒请求数限制有什么区别？',
    ],
  },
};
