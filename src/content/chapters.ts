import type { Chapter } from './types';

export const chapters: Chapter[] = [
  { id: 'html-a11y', index: 1, title: 'HTML、语义化与可访问性', summary: '构建有意义、可操作的页面结构。' },
  { id: 'css', index: 2, title: 'CSS 布局、渲染与工程化', summary: '理解布局、层叠和可维护样式。' },
  { id: 'javascript-core', index: 3, title: 'JavaScript 语言核心', summary: '掌握执行上下文、对象模型与类型语义。' },
  { id: 'javascript-async', index: 4, title: 'JavaScript 异步与 Web API', summary: '理解事件循环、并发与浏览器 API。' },
  { id: 'typescript', index: 5, title: 'TypeScript 类型系统', summary: '用类型表达约束与数据关系。' },
  { id: 'react', index: 6, title: 'React 原理与应用架构', summary: '理解渲染、状态与组件边界。' },
  { id: 'vue', index: 7, title: 'Vue 3 原理与应用架构', summary: '掌握响应式、更新调度与组合式设计。' },
  { id: 'browser-network', index: 8, title: '浏览器与网络', summary: '连接导航、协议、缓存与渲染。' },
  { id: 'quality', index: 9, title: '性能、安全与稳定性', summary: '建立可衡量、可防护的质量体系。' },
  { id: 'engineering', index: 10, title: '构建、测试与工程体系', summary: '控制交付过程和变化成本。' },
  { id: 'interview', index: 11, title: '手写题、项目设计与面试表达', summary: '把理解转成实现与清晰表达。' },
];
