import { lazy, Suspense } from 'react';
import { getTopic, loadAllPractices } from '../../content/registry';

// 表格数据和渲染表格的组件一起惰性加载，理由同 /code：页面模块顶层 import
// 的东西都会进首屏包，而 FilterBar 和这些表格只服务这一页。
const ReferenceTables = lazy(async () => {
  const [{ default: ReferenceCatalog }, practices] = await Promise.all([
    import('./ReferenceCatalog'),
    loadAllPractices(),
  ]);

  const entries = practices
    .filter(practice => practice.reference)
    .map(practice => ({ topic: getTopic(practice.slug)!, table: practice.reference! }));

  return { default: () => <ReferenceCatalog entries={entries} /> };
});

export default function ReferencePage() {
  return (
    <div className="reference-page">
      <header>
        <p>QUICK / REFERENCE</p>
        <h1 tabIndex={-1}>前端速查表</h1>
        <p>用于面试前快速唤醒概念；每一张表都来自包含机制、边界和证据的完整专题。</p>
      </header>

      <Suspense fallback={<p role="status">正在加载速查表…</p>}>
        <ReferenceTables />
      </Suspense>
    </div>
  );
}
