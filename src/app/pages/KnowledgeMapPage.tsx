import { lazy, Suspense } from 'react';

/*
  地图正文连同关系图计算和筛选控件一起放进惰性分片。

  路由表刻意静态导入所有页面（见 routes.tsx 的说明），所以页面模块顶层引用
  什么，什么就会进首屏包。这一页的图计算和 FilterBar 只有它自己用得上，
  用 React.lazy 切出去——那是 Suspense 边界，预渲染会等它完成，静态 HTML
  里仍有完整内容，hydrate 时也不会清空。/code 和 /reference 用的是同一套做法。
*/
const KnowledgeMapView = lazy(() => import('./KnowledgeMapView'));

export default function KnowledgeMapPage() {
  return (
    <Suspense fallback={<p role="status">正在加载知识地图…</p>}>
      <KnowledgeMapView />
    </Suspense>
  );
}
