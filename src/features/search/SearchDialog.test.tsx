import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RouterProvider } from 'react-router-dom';
import { describe, expect, test } from 'vitest';
import { createTestRouter } from '../../app/router';
import { topicPath } from '../../app/paths';
import { searchTopics } from './searchIndex';

function renderApp() {
  const router = createTestRouter(['/']);
  render(<RouterProvider router={router} />);
  return router;
}

describe('SearchDialog', () => {
  test('slash opens, Escape closes, and focus returns to the trigger', async () => {
    const user = userEvent.setup();
    renderApp();
    const trigger = screen.getByRole('button', { name: '搜索手册' });
    trigger.focus();

    await user.keyboard('/');
    expect(screen.getByRole('dialog', { name: '搜索手册' })).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: '搜索手册' })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  test('slash does not open search while typing in an input or textarea', async () => {
    const user = userEvent.setup();
    renderApp();
    const outsideInput = document.createElement('input');
    outsideInput.setAttribute('aria-label', '外部输入框');
    document.body.append(outsideInput);
    outsideInput.focus();

    await user.keyboard('/');

    expect(screen.queryByRole('dialog', { name: '搜索手册' })).not.toBeInTheDocument();
    outsideInput.remove();
  });

  test('arrow keys select results and Enter opens the active link', async () => {
    const user = userEvent.setup();
    const router = renderApp();
    await user.click(screen.getByRole('button', { name: '搜索手册' }));

    const input = screen.getByRole('combobox', { name: '搜索知识点' });
    await user.type(input, '渲染');

    const results = searchTopics('渲染');
    expect(results.length).toBeGreaterThan(1);
    const firstId = input.getAttribute('aria-activedescendant');

    await user.keyboard('{ArrowDown}');
    const secondId = input.getAttribute('aria-activedescendant');
    expect(secondId).not.toBe(firstId);

    await user.keyboard('{ArrowUp}');
    expect(input).toHaveAttribute('aria-activedescendant', firstId ?? '');

    await user.keyboard('{ArrowDown}{Enter}');
    await waitFor(() => {
      expect(router.state.location.pathname).toBe(topicPath(results[1].item));
    });
  });

  test('keeps Tab focus inside the dialog and highlights the query', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByRole('button', { name: '搜索手册' }));

    const dialog = screen.getByRole('dialog', { name: '搜索手册' });
    const input = screen.getByRole('combobox', { name: '搜索知识点' });
    await user.type(input, '渲染');

    expect(within(dialog).getAllByText('渲染', { selector: 'mark' }).length)
      .toBeGreaterThan(0);

    input.focus();
    await user.tab();
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
    await user.tab();
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
  });
});
