import { describe, expect, test, vi } from 'vitest';
import worker from './index';

function createEnv(handler: (request: Request) => Promise<Response>) {
  return { ASSETS: { fetch: vi.fn(handler) } };
}

describe('Sites worker SPA fallback', () => {
  test('falls back to index.html for a missing client route', async () => {
    const env = createEnv(async request => {
      const path = new URL(request.url).pathname;
      return path === '/index.html'
        ? new Response('<main>handbook</main>', { status: 200 })
        : new Response('missing', { status: 404 });
    });

    const response = await worker.fetch(
      new Request('https://example.com/handbook/javascript-async/event-loop'),
      env,
    );

    expect(response.status).toBe(200);
    expect(await response.text()).toContain('handbook');
    expect(env.ASSETS.fetch).toHaveBeenCalledTimes(2);
    expect(new URL(env.ASSETS.fetch.mock.calls[1][0].url).pathname).toBe('/index.html');
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
