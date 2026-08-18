import { describe, expect, test, vi } from 'vitest';
import worker from './index';

function createEnv(handler: (request: Request) => Promise<Response>) {
  return { ASSETS: { fetch: vi.fn(handler) } };
}

describe('Sites worker fallback', () => {
  test('serves the prerendered page for a known route without any fallback', async () => {
    const env = createEnv(async () => new Response('<main>event loop</main>', {
      status: 200,
      headers: { 'content-type': 'text/html' },
    }));

    const response = await worker.fetch(
      new Request('https://example.com/handbook/javascript-async/event-loop'),
      env,
    );

    expect(response.status).toBe(200);
    expect(await response.text()).toContain('event loop');
    expect(env.ASSETS.fetch).toHaveBeenCalledTimes(1);
  });

  test('resolves a slash-less route to its prerendered directory index', async () => {
    const env = createEnv(async request => {
      const path = new URL(request.url).pathname;
      return path === '/handbook/quality/xss-defense/index.html'
        ? new Response('<main>XSS 防御</main>', { status: 200 })
        : new Response('missing', { status: 404 });
    });

    const response = await worker.fetch(
      new Request('https://example.com/handbook/quality/xss-defense'),
      env,
    );

    // 没有这一步，规范地址会退化成没有内容的 SPA 壳。
    expect(response.status).toBe(200);
    expect(await response.text()).toContain('XSS 防御');
  });

  test('falls back to 404.html and keeps a 404 status for an unknown route', async () => {
    const env = createEnv(async request => {
      const path = new URL(request.url).pathname;
      return path === '/404.html'
        ? new Response('<main>页面没有收录</main>', { status: 200 })
        : new Response('missing', { status: 404 });
    });

    const response = await worker.fetch(
      new Request('https://example.com/handbook/does-not-exist'),
      env,
    );

    // 关键：不能回退到首页内容，也不能把不存在的地址报成 200。
    expect(response.status).toBe(404);
    expect(await response.text()).toContain('页面没有收录');

    // 原请求 → 目录索引探测 → 404 页
    const paths = env.ASSETS.fetch.mock.calls.map(
      call => new URL(call[0].url).pathname,
    );
    expect(paths).toEqual([
      '/handbook/does-not-exist',
      '/handbook/does-not-exist/index.html',
      '/404.html',
    ]);
  });

  test('preserves the original 404 for a missing static asset', async () => {
    const env = createEnv(async () => new Response('missing asset', { status: 404 }));

    const response = await worker.fetch(
      new Request('https://example.com/assets/missing.js'),
      env,
    );

    expect(response.status).toBe(404);
    expect(await response.text()).toBe('missing asset');
    expect(env.ASSETS.fetch).toHaveBeenCalledTimes(1);
  });

  test('returns an existing public asset without a fallback', async () => {
    const env = createEnv(async () => new Response('image', {
      status: 200,
      headers: { 'content-type': 'image/png' },
    }));

    const response = await worker.fetch(
      new Request('https://example.com/og.png'),
      env,
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('image/png');
    expect(env.ASSETS.fetch).toHaveBeenCalledTimes(1);
  });
});
