import { StrictMode } from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { Writable } from 'node:stream';
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from 'react-router';
import { createRoutes } from './app/routes';

export { collectRoutes } from './app/routeManifest';

/**
 * 渲染一条路由为完整 HTML 片段。
 *
 * 专题正文通过 React.lazy 加载，renderToString 只会拿到 Suspense fallback，
 * 所以这里用 renderToPipeableStream 并等待 onAllReady——它会在所有 Suspense
 * 边界解析完成后才输出，正文因此进入静态 HTML。
 */
export async function render(url: string): Promise<string> {
  const routes = createRoutes();
  const handler = createStaticHandler(routes);
  const context = await handler.query(new Request('http://localhost' + url));

  if (context instanceof Response) {
    throw new Error(`预渲染 ${url} 时收到重定向或错误响应：${context.status}`);
  }

  // 必须传 handler.dataRoutes：query() 解析 lazy 路由后的结果在这里，
  // 直接传原始 routes 会得到 Component 未定义的空渲染。
  const router = createStaticRouter(handler.dataRoutes, context);

  return new Promise<string>((resolve, reject) => {
    let html = '';
    const sink = new Writable({
      write(chunk: Buffer, _encoding: string, callback: () => void) {
        html += chunk.toString();
        callback();
      },
    });

    // 单条路由不该渲染这么久；卡住通常意味着有 Suspense 永远不解析。
    const timeout = setTimeout(() => {
      abort();
      reject(new Error(`预渲染 ${url} 超时`));
    }, 20_000);

    sink.on('finish', () => {
      clearTimeout(timeout);
      resolve(html);
    });

    const { pipe, abort } = renderToPipeableStream(
      <StrictMode>
        <StaticRouterProvider router={router} context={context} />
      </StrictMode>,
      {
        onAllReady() {
          pipe(sink);
        },
        onError(error) {
          clearTimeout(timeout);
          reject(error);
        },
      },
    );
  });
}
