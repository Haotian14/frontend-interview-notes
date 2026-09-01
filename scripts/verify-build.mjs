import { gzipSync } from 'node:zlib';
import { readdir, readFile, stat } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { stdout } from 'node:process';

const clientDist = join('dist', 'client');
const html = await readFile(join(clientDist, 'index.html'), 'utf8');
const initialFiles = new Set();
const assetPattern = /(?:src|href)="\/?(assets\/[^"]+\.js)"/g;
let match;

while ((match = assetPattern.exec(html))) {
  initialFiles.add(match[1]);
}

if (!initialFiles.size) {
  throw new Error('无法从 dist/index.html 找到首屏 JavaScript。');
}

// 页面现在是预渲染的：首屏文字不依赖 JavaScript，这些字节影响的是可交互时间，
// 而不是首次绘制。因此分别盯两个数：框架基线（几乎不动）和应用代码（会随功能增长）。
let vendorGzipBytes = 0;
let appGzipBytes = 0;

for (const file of initialFiles) {
  const bytes = gzipSync(await readFile(join(clientDist, file))).byteLength;
  if (/vendor-/.test(file)) {
    vendorGzipBytes += bytes;
  } else {
    appGzipBytes += bytes;
  }
}

const initialGzipBytes = vendorGzipBytes + appGzipBytes;

// 应用代码的上限是真正的护栏：框架体积不该成为业务代码膨胀的掩护。
const appLimit = 30 * 1024;
if (appGzipBytes > appLimit) {
  throw new Error(`首屏应用代码 gzip 超出 30KB：${appGzipBytes} bytes`);
}

const initialLimit = 130 * 1024;
if (initialGzipBytes > initialLimit) {
  throw new Error(`首屏 JavaScript gzip 超出 130KB：${initialGzipBytes} bytes`);
}

// 预渲染必须真的产出内容，否则 SEO 与首屏收益全部落空。
const homeHtml = await readFile(join(clientDist, 'index.html'), 'utf8');
if (/<div id="root"><\/div>/.test(homeHtml)) {
  throw new Error('dist/index.html 没有预渲染内容');
}
for (const required of [
  join(clientDist, 'sitemap.xml'),
  join(clientDist, 'robots.txt'),
  join(clientDist, '404.html'),
  join(clientDist, 'favicon.svg'),
  join(clientDist, 'favicon-32x32.png'),
  join(clientDist, 'apple-touch-icon.png'),
  'dist/server/index.js',
  'dist/server/wrangler.json',
  'dist/.openai/hosting.json',
]) {
  await stat(required);
}

const socialImage = await stat('public/og.webp');
if (socialImage.size >= 409600) {
  throw new Error(`社交图片超过 400KB：${socialImage.size} bytes`);
}

const sourceFiles = [];
async function collect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await collect(path);
    } else {
      const isTestFile = /\.(?:test|spec)\.[^.]+$/.test(entry.name);
      if (!isTestFile && ['.ts', '.tsx', '.css'].includes(extname(entry.name))) {
        sourceFiles.push(path);
      }
    }
  }
}

await collect('src');
sourceFiles.push('index.html');

// 黑名单只覆盖真正的追踪面：Cookie 会随请求发往服务端，第三方字体域会泄露访问记录。
// localStorage 仅存在于本机、不参与任何请求，用来保存阅读进度不构成追踪，
// 因此不在此列（见 README「数据与隐私」）。
const forbidden = [
  'document.' + 'cookie',
  'fonts.' + 'googleapis',
];

// 本地存储只允许通过 progressStore 这一个封装出入，避免散落各处的直接读写。
const storageAllowlist = new Set(['src\\features\\progress\\progressStore.ts']);

for (const file of sourceFiles) {
  const content = await readFile(file, 'utf8');
  const violation = forbidden.find(value => content.includes(value));
  if (violation) throw new Error(`${file} 包含禁止行为：${violation}`);

  // 只匹配真实的成员访问，注释里提到名字不算违规。
  const storageAccess = new RegExp('(?:window\\.)?local' + 'Storage\\s*[.\\[]');
  const normalized = file.replace(/\//g, '\\');
  if (storageAccess.test(content) && !storageAllowlist.has(normalized)) {
    throw new Error(`${file} 直接访问 localStorage，请改用 features/progress/progressStore`);
  }
}

stdout.write(`Initial JavaScript gzip: ${initialGzipBytes} bytes `);
stdout.write(`(vendor ${vendorGzipBytes} + app ${appGzipBytes})\n`);
stdout.write(`Social image: ${socialImage.size} bytes\n`);
stdout.write('Forbidden behavior scan: PASS\n');
