/**
 * 把每条路由渲染成静态 HTML 写进 dist/。
 *
 * 站点内容全部在构建期确定，纯客户端渲染让爬虫只能拿到空的 #root，
 * 首屏文字也要等 JS 下载执行完才出现。预渲染同时解决这两点，
 * 并顺带产出 sitemap.xml —— 路由清单本来就有。
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const { render, collectRoutes } = await import('../dist-ssr/entry-server.js');

const DIST = join(process.cwd(), 'dist', 'client');
const template = readFileSync(join(DIST, 'index.html'), 'utf8');

// 预渲染会把首页写回 dist/index.html，因此重复执行时模板可能已经带上了上一轮的
// 内容。那会让后续注入静默失效（每页都变成首页的壳），所以在这里直接拦住。
if (!template.includes('<div id="root"></div>')) {
  throw new Error('dist/index.html 已经是预渲染结果，请先重新执行 vite build 再预渲染。');
}

const siteOrigin = process.env.SITE_ORIGIN
  ?? 'https://frontend-review-handbook.minato13.chatgpt.site';

function escapeAttribute(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** 替换模板里的标题与描述，让每个页面有自己的 SEO 元数据。 */
function applyMetadata(html, route) {
  const title = escapeAttribute(route.title);
  const description = escapeAttribute(route.description);
  const canonical = siteOrigin + route.path;

  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(
      /<meta name="description" content="[^"]*"\s*\/>/,
      `<meta name="description" content="${description}" />`,
    )
    .replace(
      /<meta property="og:title" content="[^"]*"\s*\/>/,
      `<meta property="og:title" content="${title}" />`,
    )
    .replace(
      /<meta property="og:description" content="[^"]*"\s*\/>/,
      `<meta property="og:description" content="${description}" />`,
    )
    .replace('</head>', `  <link rel="canonical" href="${canonical}" />\n  </head>`);
}

const routes = collectRoutes();
let written = 0;

for (const route of routes) {
  const appHtml = await render(route.path);

  if (!appHtml.trim()) {
    throw new Error(`预渲染 ${route.path} 得到空内容`);
  }

  // 用替换函数而不是替换字符串：React 流式输出里含有 $ 序列，
  // 作为替换字符串会被当成 $&、$' 这类捕获引用而丢内容。
  const page = applyMetadata(template, route)
    .replace('<div id="root"></div>', () => `<div id="root">${appHtml}</div>`);

  if (!page.includes(appHtml.slice(-120))) {
    throw new Error(`注入 ${route.path} 时正文被截断`);
  }

  const outputPath = route.path === '/'
    ? join(DIST, 'index.html')
    : join(DIST, route.path.replace(/^\//, ''), 'index.html');

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, page, 'utf8');
  written += 1;
}

// 未知地址回退到这个页面，而不是回退到首页的预渲染 HTML——后者会让爬虫
// 看到首页内容，也会让客户端 hydrate 时和 404 路由不一致。
const notFoundHtml = await render('/__not-found__');
writeFileSync(
  join(DIST, '404.html'),
  applyMetadata(template, {
    path: '/404',
    title: '页面没有收录 · 前端复习手册',
    description: '这个地址不存在，或者对应内容还没有进入当前版本。',
  }).replace('<div id="root"></div>', () => `<div id="root">${notFoundHtml}</div>`),
  'utf8',
);

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...routes.map(route =>
    `  <url><loc>${siteOrigin}${route.path}</loc></url>`,
  ),
  '</urlset>',
  '',
].join('\n');

writeFileSync(join(DIST, 'sitemap.xml'), sitemap, 'utf8');

writeFileSync(
  join(DIST, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${siteOrigin}/sitemap.xml\n`,
  'utf8',
);

process.stdout.write(`预渲染：${written} 个页面，sitemap 收录 ${routes.length} 条\n`);
