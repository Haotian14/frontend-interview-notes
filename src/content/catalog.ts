import type { TopicLevel } from './types';

export type TopicCatalogEntry = {
  slug: string;
  chapter: string;
  title: string;
  level: TopicLevel;
  minutes: number;
};

export const topicCatalog: TopicCatalogEntry[] = [
  { slug: 'semantic-accessibility', chapter: 'html-a11y', title: '语义化 HTML 与可访问性', level: '基础', minutes: 20 },
  { slug: 'form-validation', chapter: 'html-a11y', title: '表单控件与原生校验', level: '高频', minutes: 24 },
  { slug: 'responsive-images', chapter: 'html-a11y', title: '响应式图片与媒体加载', level: '基础', minutes: 22 },
  { slug: 'stacking-context', chapter: 'css', title: '层叠上下文与 z-index', level: '高频', minutes: 24 },
  { slug: 'cascade-specificity', chapter: 'css', title: '层叠、优先级与继承', level: '高频', minutes: 24 },
  { slug: 'flex-grid-layout', chapter: 'css', title: 'Flexbox 与 Grid 布局模型', level: '高频', minutes: 28 },
  { slug: 'bfc-margin-collapse', chapter: 'css', title: 'BFC 与外边距折叠', level: '基础', minutes: 20 },
  { slug: 'closures-scope', chapter: 'javascript-core', title: '作用域链与闭包', level: '高频', minutes: 26 },
  { slug: 'this-binding', chapter: 'javascript-core', title: 'this 绑定与调用点', level: '高频', minutes: 22 },
  { slug: 'prototype-inheritance', chapter: 'javascript-core', title: '原型链与继承', level: '高频', minutes: 26 },
  { slug: 'type-coercion', chapter: 'javascript-core', title: '类型转换与相等比较', level: '基础', minutes: 24 },
  { slug: 'module-systems', chapter: 'javascript-core', title: '模块系统与 ESM', level: '进阶', minutes: 24 },
  { slug: 'event-loop', chapter: 'javascript-async', title: '事件循环与任务队列', level: '高频', minutes: 24 },
  { slug: 'promise-semantics', chapter: 'javascript-async', title: 'Promise 状态机与组合', level: '高频', minutes: 26 },
  { slug: 'async-await-errors', chapter: 'javascript-async', title: 'async/await 与错误处理', level: '高频', minutes: 24 },
  { slug: 'abort-race', chapter: 'javascript-async', title: '请求取消与竞态', level: '进阶', minutes: 24 },
  { slug: 'type-narrowing', chapter: 'typescript', title: '类型收窄与穷尽检查', level: '高频', minutes: 24 },
  { slug: 'generics-constraints', chapter: 'typescript', title: '泛型与约束', level: '高频', minutes: 24 },
  { slug: 'conditional-mapped-types', chapter: 'typescript', title: '条件类型与映射类型', level: '进阶', minutes: 26 },
  { slug: 'structural-variance', chapter: 'typescript', title: '结构化类型与型变', level: '进阶', minutes: 24 },
  { slug: 'render-state-snapshot', chapter: 'react', title: 'React 渲染与状态快照', level: '高频', minutes: 26 },
  { slug: 'hooks-dependencies', chapter: 'react', title: 'Hooks 规则与依赖数组', level: '高频', minutes: 26 },
  { slug: 'reconciliation-keys', chapter: 'react', title: '协调算法与 key', level: '高频', minutes: 24 },
  { slug: 'react-performance', chapter: 'react', title: 'React 性能优化', level: '进阶', minutes: 26 },
  { slug: 'state-architecture', chapter: 'react', title: '状态归属与 Context 边界', level: '进阶', minutes: 24 },
  { slug: 'vue-reactivity', chapter: 'vue', title: 'Vue 3 响应式与依赖追踪', level: '高频', minutes: 26 },
  { slug: 'vue-render-nexttick', chapter: 'vue', title: 'Vue 更新调度与 nextTick', level: '高频', minutes: 24 },
  { slug: 'composition-composables', chapter: 'vue', title: 'Composition API 与组合式函数', level: '高频', minutes: 24 },
  { slug: 'pinia-state-architecture', chapter: 'vue', title: 'Pinia 状态设计与边界', level: '进阶', minutes: 24 },
  { slug: 'rendering-pipeline', chapter: 'browser-network', title: '浏览器渲染流水线', level: '高频', minutes: 28 },
  { slug: 'http-cache', chapter: 'browser-network', title: 'HTTP 缓存与重新验证', level: '高频', minutes: 26 },
  { slug: 'cors-cross-origin', chapter: 'browser-network', title: '同源策略与 CORS', level: '高频', minutes: 26 },
  { slug: 'web-storage-cookies', chapter: 'browser-network', title: '浏览器存储与 Cookie', level: '高频', minutes: 24 },
  { slug: 'http-versions', chapter: 'browser-network', title: 'HTTP 版本演进与连接', level: '进阶', minutes: 26 },
  { slug: 'xss-defense', chapter: 'quality', title: 'XSS 防御与内容安全策略', level: '高频', minutes: 26 },
  { slug: 'web-vitals', chapter: 'quality', title: 'Core Web Vitals 与性能测量', level: '高频', minutes: 26 },
  { slug: 'csrf-defense', chapter: 'quality', title: 'CSRF 与身份凭证', level: '高频', minutes: 24 },
  { slug: 'error-monitoring', chapter: 'quality', title: '前端错误监控与稳定性', level: '进阶', minutes: 24 },
  { slug: 'testing-strategy', chapter: 'engineering', title: '前端测试策略与分层', level: '进阶', minutes: 24 },
  { slug: 'bundling-tree-shaking', chapter: 'engineering', title: '打包、Tree Shaking 与产物', level: '进阶', minutes: 24 },
  { slug: 'code-splitting', chapter: 'engineering', title: '代码分割与按需加载', level: '进阶', minutes: 24 },
  { slug: 'ci-quality-gates', chapter: 'engineering', title: 'CI 质量闸门与发布', level: '进阶', minutes: 22 },
  { slug: 'infinite-canvas-architecture', chapter: 'engineering', title: '无限画布的状态与渲染架构', level: '进阶', minutes: 28 },
  { slug: 'autosave-conflict-control', chapter: 'engineering', title: '自动保存、队列与冲突控制', level: '进阶', minutes: 26 },
  { slug: 'debounce-throttle', chapter: 'interview', title: '防抖与节流的实现与取舍', level: '高频', minutes: 24 },
  { slug: 'handwritten-promise', chapter: 'interview', title: '手写 Promise', level: '进阶', minutes: 28 },
  { slug: 'deep-clone', chapter: 'interview', title: '深拷贝的实现与边界', level: '高频', minutes: 24 },
  { slug: 'frontend-system-design', chapter: 'interview', title: '前端系统设计的表达框架', level: '进阶', minutes: 24 },
  { slug: 'concurrency-pool', chapter: 'interview', title: '手写 Promise 并发池', level: '高频', minutes: 24 },
  { slug: 'virtual-list', chapter: 'interview', title: '虚拟列表的实现与性能边界', level: '进阶', minutes: 26 },
];
