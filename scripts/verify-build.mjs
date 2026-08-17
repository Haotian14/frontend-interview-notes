import { gzipSync } from 'node:zlib';
import { readdir, readFile, stat } from 'node:fs/promises';
import { extname, join } from 'node:path';

const html = await readFile('dist/index.html', 'utf8');
const initialFiles = new Set();
const assetPattern = /(?:src|href)="\/?(assets\/[^"]+\.js)"/g;
let match;

while ((match = assetPattern.exec(html))) {
  initialFiles.add(match[1]);
}

if (!initialFiles.size) {
  throw new Error('无法从 dist/index.html 找到首屏 JavaScript。');
}

let initialGzipBytes = 0;
for (const file of initialFiles) {
  initialGzipBytes += gzipSync(await readFile(join('dist', file))).byteLength;
}

const initialLimit = 100 * 1024;
if (initialGzipBytes > initialLimit) {
  throw new Error(`首屏 JavaScript gzip 超出 100KB：${initialGzipBytes} bytes`);
}

const socialImage = await stat('public/og.webp');
if (socialImage.size >= 409600) {
  throw new Error(`社交图片超过 400KB：${socialImage.size} bytes`);
}

const sourceFiles = [];
async function collect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await collect(path);
    else if (['.ts', '.tsx', '.css'].includes(extname(entry.name))) sourceFiles.push(path);
  }
}

await collect('src');
sourceFiles.push('index.html');

const forbidden = [
  'local' + 'Storage',
  'session' + 'Storage',
  'indexed' + 'DB',
  'document.' + 'cookie',
  'fonts.' + 'googleapis',
];

for (const file of sourceFiles) {
  const content = await readFile(file, 'utf8');
  const violation = forbidden.find(value => content.includes(value));
  if (violation) throw new Error(`${file} 包含禁止行为：${violation}`);
}

console.log(`Initial JavaScript gzip: ${initialGzipBytes} bytes`);
console.log(`Social image: ${socialImage.size} bytes`);
console.log('Forbidden behavior scan: PASS');
