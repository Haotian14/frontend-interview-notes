import type { TopicMeta } from '../../../types';

export const meta: TopicMeta = {
  slug: 'error-monitoring',
  chapter: 'quality',
  order: 4,
  title: '前端错误监控与稳定性',
  summary: '覆盖全局异常、未处理拒绝、资源加载与接口失败四类信号，讲清采集口径、去噪、Source Map 与告警阈值。',
  level: '进阶',
  minutes: 24,
  keywords: ['错误监控', 'unhandledrejection', 'Source Map', '错误边界', '采样'],
  prerequisites: ['async-await-errors'],
  related: ['async-await-errors', 'web-vitals', 'testing-strategy'],
  sources: [
    { label: 'MDN — GlobalEventHandlers.onerror', href: 'https://developer.mozilla.org/en-US/docs/Web/API/Window/error_event' },
    { label: 'MDN — unhandledrejection event', href: 'https://developer.mozilla.org/en-US/docs/Web/API/Window/unhandledrejection_event' },
  ],
  searchText: '错误监控 window.onerror error 事件 unhandledrejection 资源加载失败 捕获阶段 Script error 跨域脚本 crossorigin Source Map 还原堆栈 错误边界 ErrorBoundary 采样 去重 指纹 告警阈值 灰度回滚 sendBeacon',
  hasCode: true,
};
