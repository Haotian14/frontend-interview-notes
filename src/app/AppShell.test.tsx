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

  test('opens the mobile menu and closes it with Escape', async () => {
    const user = userEvent.setup();
    render(<RouterProvider router={createTestRouter(['/'])} />);

    const trigger = screen.getByRole('button', { name: '打开导航菜单' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const menu = screen.getByRole('navigation', { name: '移动导航' });
    expect(within(menu).getByRole('link', { name: /JavaScript 异步与 Web API/ })).toBeVisible();

    await user.keyboard('{Escape}');

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('navigation', { name: '移动导航' })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  /*
    移动端 header 的主导航被媒体查询隐藏，抽屉是唯一入口。这条断言存在的
    意义就是防止一级栏目再次只留在被隐藏的 header 里。
  */
  test('carries every primary destination inside the mobile menu', async () => {
    const user = userEvent.setup();
    render(<RouterProvider router={createTestRouter(['/'])} />);

    await user.click(screen.getByRole('button', { name: '打开导航菜单' }));
    const menu = screen.getByRole('navigation', { name: '移动导航' });

    for (const [label, href] of [
      ['复习手册', '/handbook'],
      ['知识地图', '/knowledge-map'],
      ['面试题库', '/interview'],
      ['代码手册', '/code'],
      ['资料索引', '/reference'],
    ]) {
      expect(within(menu).getByRole('link', { name: label })).toHaveAttribute('href', href);
    }
  });

  test('closes the mobile menu when the backdrop is clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(<RouterProvider router={createTestRouter(['/'])} />);

    await user.click(screen.getByRole('button', { name: '打开导航菜单' }));
    expect(document.body.style.overflow).toBe('hidden');

    await user.click(container.querySelector('.mobile-menu-backdrop')!);

    expect(screen.queryByRole('navigation', { name: '移动导航' })).not.toBeInTheDocument();
    expect(document.body.style.overflow).not.toBe('hidden');
  });
});
