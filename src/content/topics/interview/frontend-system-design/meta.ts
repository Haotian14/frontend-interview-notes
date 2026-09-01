import type { TopicMeta } from '../../../types';

export const meta: TopicMeta = {
  slug: 'frontend-system-design',
  chapter: 'interview',
  order: 4,
  title: '前端系统设计的表达框架',
  summary: '用需求澄清、方案骨架、数据流、边界场景、权衡取舍五步结构化地回答开放式设计题。',
  level: '进阶',
  minutes: 24,
  keywords: ['系统设计', '面试表达', '需求澄清', '权衡取舍', '项目复盘'],
  prerequisites: ['state-architecture'],
  related: ['state-architecture', 'code-splitting', 'web-vitals', 'testing-strategy'],
  sources: [
    { label: 'web.dev — Learn Performance', href: 'https://web.dev/learn/performance' },
    { label: 'React — Thinking in React', href: 'https://react.dev/learn/thinking-in-react' },
  ],
  searchText: '前端系统设计 面试表达 开放题 需求澄清 约束 方案骨架 组件划分 数据流 状态归属 接口设计 边界场景 弱网 空状态 权衡取舍 trade-off 项目复盘 STAR 量化结果 无限滚动 评论系统 富文本',
  hasCode: false,
};
