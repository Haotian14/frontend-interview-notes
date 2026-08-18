import type { RouteObject } from 'react-router-dom';
import { chapters } from '../content/chapters';
import { getTopic } from '../content/registry';
import AppShell from './AppShell';
import RootErrorBoundary from './RootErrorBoundary';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import HandbookPage from './pages/HandbookPage';
import ChapterPage from './pages/ChapterPage';
import TopicPage from './pages/TopicPage';
import KnowledgeMapPage from './pages/KnowledgeMapPage';
import InterviewPage from './pages/InterviewPage';
import CodePage from './pages/CodePage';
import ReferencePage from './pages/ReferencePage';

type Params = Record<string, string | undefined>;

/**
 * 路由表单独成模块：router.tsx 在模块求值期就会调用 createBrowserRouter，
 * 那在 Node 里没有 history 可用。预渲染只需要路由表本身。
 *
 * 页面组件一律静态导入。用 route.lazy 时，数据路由在初次加载必须先解析该路由
 * 才能渲染，此期间渲染 null，会把预渲染出来的 HTML 清空再等分片到达——
 * 既有闪烁，也白费了预渲染。真正体量大的是专题正文，它仍由 TopicPage 里的
 * React.lazy 分片；那是 Suspense 边界，hydrate 时会保留服务端 HTML。
 */
export function createRoutes(): RouteObject[] {
  return [
    {
      path: '/',
      element: <AppShell />,
      errorElement: <RootErrorBoundary />,
      children: [
        { index: true, element: <HomePage />, handle: { title: '首页' } },
        { path: 'handbook', element: <HandbookPage />, handle: { title: '完整手册目录' } },
        {
          path: 'handbook/:chapter',
          element: <ChapterPage />,
          handle: {
            title: (params: Params) =>
              chapters.find(item => item.id === params.chapter)?.title ?? '手册章节',
          },
        },
        {
          path: 'handbook/:chapter/:topic',
          element: <TopicPage />,
          handle: {
            title: (params: Params) => getTopic(params.topic ?? '')?.title ?? '专题',
          },
        },
        { path: 'knowledge-map', element: <KnowledgeMapPage />, handle: { title: '知识地图' } },
        { path: 'interview', element: <InterviewPage />, handle: { title: '面试训练场' } },
        { path: 'code', element: <CodePage />, handle: { title: '代码手册' } },
        { path: 'reference', element: <ReferencePage />, handle: { title: '前端速查表' } },
        { path: '*', element: <NotFoundPage />, handle: { title: '页面没有收录' } },
      ],
    },
  ];
}
