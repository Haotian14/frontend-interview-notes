import { render, screen, within } from '@testing-library/react';
import { RouterProvider } from 'react-router-dom';
import { describe, expect, test } from 'vitest';
import { topics } from '../../content/registry';
import { topicPath } from '../paths';
import { createTestRouter } from '../router';

function renderRoute(path: string) {
  const router = createTestRouter([path]);
  const view = render(<RouterProvider router={router} />);
  return view;
}

describe('secondary pages', () => {
  test.each([
    ['/interview', '面试训练场'],
    ['/code', '代码手册'],
    ['/reference', '前端速查表'],
  ])('%s has one unique page heading', async (path, heading) => {
    const view = renderRoute(path);
    expect(await screen.findByRole('heading', { level: 1, name: heading }))
      .toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    view.unmount();
  });

  test('code examples link to their real topic routes', async () => {
    const topic = topics.find(item => item.hasCode);
    if (!topic) throw new Error('测试需要代码专题');
    const view = renderRoute('/code');

    const link = await screen.findByRole('link', { name: new RegExp(topic.title) });
    expect(link).toHaveAttribute('href', topicPath(topic));
    view.unmount();
  });

  test('reference tables have captions and topic links', async () => {
    const view = renderRoute('/reference');
    await screen.findByRole('heading', { name: '前端速查表' });

    const tables = screen.getAllByRole('table');
    expect(tables).toHaveLength(5);
    for (const table of tables) {
      expect(within(table).getByText(/速查|选择/)).toBeInTheDocument();
      expect(within(table).getAllByRole('link').length).toBeGreaterThan(0);
    }
    view.unmount();
  });

  test('interview filters expose accessible names on mobile and desktop', async () => {
    const view = renderRoute('/interview');
    expect(await screen.findByRole('combobox', { name: '章节筛选' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: '难度筛选' })).toBeInTheDocument();
    view.unmount();
  });
});
