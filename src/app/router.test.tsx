import { act, render, screen, waitFor } from '@testing-library/react';
import { RouterProvider } from 'react-router-dom';
import { describe, expect, test } from 'vitest';
import { getChapterTopics, topics } from '../content/registry';
import { createTestRouter } from './router';

async function renderRoute(path: string) {
  const router = createTestRouter([path]);
  const view = render(<RouterProvider router={router} />);
  return { router, ...view };
}

describe('application routes', () => {
  test.each([
    ['/', '前端工程师系统复习手册'],
    ['/handbook', '完整手册目录'],
    ['/handbook/javascript-async', 'JavaScript 异步与 Web API'],
    ['/knowledge-map', '知识地图'],
    ['/interview', '面试训练场'],
    ['/code', '代码手册'],
    ['/reference', '前端速查表'],
    ['/missing', '页面没有收录'],
  ])('%s renders its page heading', async (path, heading) => {
    const view = await renderRoute(path);
    expect(await screen.findByRole('heading', { level: 1, name: heading })).toBeInTheDocument();
    view.unmount();
  });

  test('chapter pages only render topics from the requested chapter', async () => {
    const chapterTopics = getChapterTopics('javascript-async');
    const outsideTopic = topics.find(topic => topic.chapter !== 'javascript-async');
    const view = await renderRoute('/handbook/javascript-async');

    for (const topic of chapterTopics) {
      expect(await screen.findByRole('link', { name: topic.title })).toBeInTheDocument();
    }
    if (outsideTopic) {
      expect(screen.queryByRole('link', { name: outsideTopic.title })).not.toBeInTheDocument();
    }
    view.unmount();
  });

  test('an unknown chapter reaches the not-found page', async () => {
    const view = await renderRoute('/handbook/not-a-chapter');
    expect(await screen.findByRole('heading', { name: '页面没有收录' })).toBeInTheDocument();
    view.unmount();
  });

  test('route changes update the title and focus the new h1', async () => {
    const { router, unmount } = await renderRoute('/');
    await screen.findByRole('heading', { name: '前端工程师系统复习手册' });

    await act(async () => {
      await router.navigate('/knowledge-map');
    });

    const heading = await screen.findByRole('heading', { name: '知识地图' });
    await waitFor(() => {
      expect(document.title).toBe('知识地图 · 前端复习手册');
      expect(heading).toHaveFocus();
    });
    unmount();
  });

  test('derives specific document titles for chapter and topic routes', async () => {
    // 标题只由路由 handle 计算；专题页不能退化成通用的「专题」。
    const topicView = await renderRoute('/handbook/javascript-core/closures-scope');
    await screen.findByRole('heading', { level: 1, name: '作用域链与闭包' });
    await waitFor(() => {
      expect(document.title).toBe('作用域链与闭包 · 前端复习手册');
    });
    topicView.unmount();

    const chapterView = await renderRoute('/handbook/quality');
    await screen.findByRole('heading', { level: 1, name: '性能、安全与稳定性' });
    await waitFor(() => {
      expect(document.title).toBe('性能、安全与稳定性 · 前端复习手册');
    });
    chapterView.unmount();
  });

  test('opens and reloads a topic at the same stable URL', async () => {
    const path = '/handbook/javascript-async/event-loop';
    const first = await renderRoute(path);
    expect(await screen.findByRole('heading', { level: 1, name: '事件循环与任务队列' }))
      .toBeInTheDocument();
    first.unmount();

    const reloaded = await renderRoute(path);
    expect(await screen.findByRole('heading', { level: 1, name: '事件循环与任务队列' }))
      .toBeInTheDocument();
    reloaded.unmount();
  });
});
