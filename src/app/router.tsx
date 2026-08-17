import type { RouteObject } from 'react-router-dom';
import { createBrowserRouter, createMemoryRouter } from 'react-router-dom';
import AppShell from './AppShell';
import RootErrorBoundary from './RootErrorBoundary';
import ChapterPage from './pages/ChapterPage';
import HandbookPage from './pages/HandbookPage';
import HomePage from './pages/HomePage';
import KnowledgeMapPage from './pages/KnowledgeMapPage';
import NotFoundPage from './pages/NotFoundPage';

function createRoutes(): RouteObject[] {
  return [
    {
      path: '/',
      element: <AppShell />,
      errorElement: <RootErrorBoundary />,
      children: [
        {
          index: true,
          element: <HomePage />,
          handle: { title: '首页' },
        },
        {
          path: 'handbook',
          element: <HandbookPage />,
          handle: { title: '完整手册目录' },
        },
        {
          path: 'handbook/:chapter',
          element: <ChapterPage />,
          handle: { title: '手册章节' },
        },
        {
          path: 'handbook/:chapter/:topic',
          lazy: async () => ({
            Component: (await import('./pages/TopicPage')).default,
          }),
          handle: { title: '专题' },
        },
        {
          path: 'knowledge-map',
          element: <KnowledgeMapPage />,
          handle: { title: '知识地图' },
        },
        {
          path: 'interview',
          lazy: async () => ({
            Component: (await import('./pages/InterviewPage')).default,
          }),
          handle: { title: '面试训练场' },
        },
        {
          path: 'code',
          lazy: async () => ({
            Component: (await import('./pages/CodePage')).default,
          }),
          handle: { title: '代码手册' },
        },
        {
          path: 'reference',
          lazy: async () => ({
            Component: (await import('./pages/ReferencePage')).default,
          }),
          handle: { title: '前端速查表' },
        },
        {
          path: '*',
          element: <NotFoundPage />,
          handle: { title: '页面没有收录' },
        },
      ],
    },
  ];
}

export const appRouter = createBrowserRouter(createRoutes());

export function createTestRouter(initialEntries: string[]) {
  return createMemoryRouter(createRoutes(), { initialEntries });
}
