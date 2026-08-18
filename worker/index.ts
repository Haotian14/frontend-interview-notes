type Env = {
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };
};

function looksLikeAsset(pathname: string) {
  return pathname.split('/').pop()?.includes('.') ?? false;
}

function get(env: Env, url: URL, pathname: string, request: Request) {
  return env.ASSETS.fetch(
    new Request(new URL(pathname, url), {
      method: 'GET',
      headers: request.headers,
    }),
  );
}

export default {
  async fetch(request: Request, env: Env) {
    const response = await env.ASSETS.fetch(request);
    const url = new URL(request.url);

    if (response.status !== 404 || looksLikeAsset(url.pathname)) {
      return response;
    }

    // 预渲染产出的是 <route>/index.html。站内链接和 canonical 都不带尾斜杠，
    // 所以这里显式解析目录索引，而不是依赖托管平台的 html_handling 行为——
    // 少了这一步，每个规范地址都会退化成没有内容的 SPA 壳。
    const withoutTrailingSlash = url.pathname.replace(/\/$/, '');
    const indexResponse = await get(
      env,
      url,
      `${withoutTrailingSlash}/index.html`,
      request,
    );

    if (indexResponse.status === 200) {
      return indexResponse;
    }

    // 地址确实不存在：返回预渲染的 404 页并保留 404 状态。
    const fallback = await get(env, url, '/404.html', request);

    return new Response(fallback.body, {
      status: 404,
      headers: fallback.headers,
    });
  },
};
