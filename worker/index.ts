type Env = {
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };
};

function looksLikeAsset(pathname: string) {
  return pathname.split('/').pop()?.includes('.') ?? false;
}

export default {
  async fetch(request: Request, env: Env) {
    const response = await env.ASSETS.fetch(request);
    const url = new URL(request.url);

    if (response.status !== 404 || looksLikeAsset(url.pathname)) {
      return response;
    }

    const fallback = new URL('/index.html', url);
    return env.ASSETS.fetch(new Request(fallback, {
      method: 'GET',
      headers: request.headers,
    }));
  },
};
