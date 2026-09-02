import { lazy, Suspense } from 'react';
import { getTopic, loadAllPractices } from '../../content/registry';

/*
  条目数据和渲染条目的组件一起惰性加载。

  路由表静态导入所有页面（见 routes.tsx），页面模块顶层 import 什么，什么就
  进首屏包——CodeCatalog 用到的 FilterBar 也一样。所以这里连组件模块一起
  动态取，首屏只留这层壳。
*/
const CodeList = lazy(async () => {
  const [{ default: CodeCatalog }, practices] = await Promise.all([
    import('./CodeCatalog'),
    loadAllPractices(),
  ]);

  const entries = practices
    .filter(practice => practice.code)
    .map(practice => ({ topic: getTopic(practice.slug)!, code: practice.code! }));

  return { default: () => <CodeCatalog entries={entries} /> };
});

export default function CodePage() {
  return (
    <div className="code-page">
      <header>
        <p>CODE / MINIMAL VERIFICATION</p>
        <h1 tabIndex={-1}>代码手册</h1>
        <p>这里索引能验证核心机制的最小示例，不在浏览器中执行任意代码。</p>
      </header>

      <Suspense fallback={<p role="status">正在加载代码条目…</p>}>
        <CodeList />
      </Suspense>
    </div>
  );
}
