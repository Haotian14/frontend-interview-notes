import { expect, test } from '@playwright/test';

const eventLoopPath = '/handbook/javascript-async/event-loop';

test('navigates the handbook and preserves browser history', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: '前端工程师系统复习手册' }))
    .toBeVisible();

  await page.getByRole('link', { name: '开始复习' }).click();
  await expect(page.getByRole('heading', { level: 1, name: '完整手册目录' })).toBeVisible();

  const main = page.locator('#main-content');
  await main.getByRole('link', { name: 'JavaScript 异步与 Web API' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'JavaScript 异步与 Web API' }))
    .toBeVisible();

  await main.getByRole('link', { name: '事件循环与任务队列' }).click();
  await expect(page.getByRole('heading', { level: 1, name: '事件循环与任务队列' }))
    .toBeVisible();

  await page.goBack();
  await expect(page.getByRole('heading', { level: 1, name: 'JavaScript 异步与 Web API' }))
    .toBeVisible();

  await page.goForward();
  await expect(page.getByRole('heading', { level: 1, name: '事件循环与任务队列' }))
    .toBeVisible();
});

test('reloads a direct topic URL without leaving the article', async ({ page }) => {
  await page.goto(eventLoopPath);
  await expect(page.getByRole('heading', { level: 1, name: '事件循环与任务队列' }))
    .toBeVisible();

  await page.reload();

  await expect(page).toHaveURL(new RegExp(`${eventLoopPath}$`));
  await expect(page.getByRole('heading', { level: 1, name: '事件循环与任务队列' }))
    .toBeVisible();
});

test('opens HTTP cache through slash search', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('/');

  const dialog = page.getByRole('dialog', { name: '搜索手册' });
  await expect(dialog).toBeVisible();
  const input = dialog.getByRole('combobox', { name: '搜索知识点' });
  await input.fill('缓存');
  await input.press('Enter');

  await expect(page).toHaveURL(/\/handbook\/browser-network\/http-cache$/);
  await expect(page.getByRole('heading', { level: 1, name: 'HTTP 缓存与重新验证' }))
    .toBeVisible();
});

test('starts the interview timer and reveals the reference answer', async ({ page }) => {
  await page.goto('/interview');
  await expect(page.getByRole('heading', { level: 1, name: '面试训练场' })).toBeVisible();
  await expect(page.getByText('剩余 90 秒')).toBeVisible();

  // 题库是惰性分片：预渲染的按钮先出现，事件处理器要等分片到达并完成 hydration。
  // 重试点击，直到这一次点击真的生效。
  await expect(async () => {
    await page.getByRole('button', { name: '显示参考答案' }).click();
    await expect(page.getByRole('heading', { name: '参考答案' })).toBeVisible({ timeout: 1000 });
  }).toPass();
});

test('opens and closes the chapter drawer at a mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const trigger = page.getByRole('button', { name: '打开章节菜单' });
  await expect(trigger).toBeVisible();
  await trigger.click();
  await expect(page.getByRole('navigation', { name: '移动章节导航' })).toBeVisible();

  await page.keyboard.press('Escape');

  await expect(page.getByRole('navigation', { name: '移动章节导航' })).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('renders a useful unknown-route page', async ({ page }) => {
  await page.goto('/not-in-the-handbook');
  await expect(page.getByRole('heading', { level: 1, name: '页面没有收录' })).toBeVisible();
});
