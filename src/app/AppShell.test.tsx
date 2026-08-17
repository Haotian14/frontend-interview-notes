import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RouterProvider } from 'react-router-dom';
import { describe, expect, test } from 'vitest';
import { createTestRouter } from './router';

describe('AppShell', () => {
  test('offers skip navigation and all primary destinations', () => {
    render(<RouterProvider router={createTestRouter(['/'])} />);

    expect(screen.getByRole('link', { name: '跳到正文' })).toHaveAttribute('href', '#main-content');

    const primary = screen.getByRole('navigation', { name: '主导航' });
    expect(within(primary).getByRole('link', { name: '复习手册' })).toHaveAttribute('href', '/handbook');
    expect(within(primary).getByRole('link', { name: '知识地图' })).toHaveAttribute('href', '/knowledge-map');
    expect(within(primary).getByRole('link', { name: '面试题库' })).toHaveAttribute('href', '/interview');
    expect(within(primary).getByRole('link', { name: '代码手册' })).toHaveAttribute('href', '/code');
    expect(within(primary).getByRole('link', { name: '资料索引' })).toHaveAttribute('href', '/reference');
  });

  test('opens the mobile chapter menu and closes it with Escape', async () => {
    const user = userEvent.setup();
    render(<RouterProvider router={createTestRouter(['/'])} />);

    const trigger = screen.getByRole('button', { name: '打开章节菜单' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const chapterMenu = screen.getByRole('navigation', { name: '移动章节导航' });
    expect(within(chapterMenu).getByRole('link', { name: /JavaScript 异步与 Web API/ })).toBeVisible();

    await user.keyboard('{Escape}');

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('navigation', { name: '移动章节导航' })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
