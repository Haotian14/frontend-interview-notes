import type { TopicMeta } from '../../../types';

export const meta: TopicMeta = {
  slug: 'abort-race',
  chapter: 'javascript-async',
  order: 4,
  title: '请求取消与竞态',
  summary: '用 AbortController 真正终止请求，并用最新请求标记或忽略过期响应解决搜索联想类的竞态问题。',
  level: '进阶',
  minutes: 24,
  keywords: ['AbortController', 'AbortSignal', '竞态', '过期响应', '清理函数'],
  prerequisites: ['async-await-errors'],
  related: ['async-await-errors', 'promise-semantics', 'debounce-throttle'],
  sources: [
    { label: 'MDN — AbortController', href: 'https://developer.mozilla.org/en-US/docs/Web/API/AbortController' },
    { label: 'DOM Standard — Aborting ongoing activities', href: 'https://dom.spec.whatwg.org/#aborting-ongoing-activities' },
  ],
  searchText: 'AbortController AbortSignal abort 取消请求 竞态 race condition 过期响应 stale response 搜索联想 输入防抖 清理函数 cleanup useEffect 组件卸载 AbortError timeout signal.throwIfAborted',
  hasCode: true,
};
