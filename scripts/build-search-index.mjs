/**
 * 从 article.mdx 正文生成检索索引。
 *
 * 之前的搜索只覆盖 meta.ts 里手写的 searchText 关键词串，正文完全搜不到；
 * 这里按「标题 → 段落」切分，让搜索能命中正文并直接跳到对应小节。
 *
 * 标题锚点必须与 rehype-slug 的结果一致：rehype-slug 为每个文档新建一个
 * GithubSlugger，并按文档顺序处理所有标题（含 h1），重复标题会自动加后缀。
 * 下面刻意复刻这个顺序，否则深链会落空。
 */
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import GithubSlugger from 'github-slugger';

const TOPICS_DIR = join(process.cwd(), 'src/content/topics');
const OUTPUT = join(process.cwd(), 'src/generated/search-index.json');

/** 每条记录的正文上限，避免 Fuse 在超长字符串上做无谓的模糊匹配。 */
const MAX_TEXT = 600;

function stripInline(text) {
  return text
    // 图片先于链接处理，否则 ![alt](src) 会留下一个孤立的 !
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[*_~]{1,3}([^*_~]+)[*_~]{1,3}/g, '$1')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/^\s*>\s?/gm, '')
    .replace(/\|/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * 把一篇文章切成可检索记录。围栏代码块保留内容（标识符是有效查询词），
 * 只去掉围栏标记；JSX 组件标签整体丢弃。
 */
export function extractSections(source) {
  const slugger = new GithubSlugger();
  const sections = [];

  let heading = null;
  let headingHash = '';
  let buffer = [];
  let inFence = false;

  const flush = () => {
    if (!heading) {
      buffer = [];
      return;
    }
    const text = stripInline(buffer.join('\n'));
    buffer = [];
    if (text) sections.push({ heading, hash: headingHash, text: text.slice(0, MAX_TEXT) });
  };

  for (const line of source.split(/\r?\n/)) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) {
      buffer.push(line);
      continue;
    }

    const match = /^(#{1,6})\s+(.*)$/.exec(line);
    if (match) {
      const title = stripInline(match[2]);
      // 所有层级都要过 slugger，才能和 rehype-slug 的去重编号对齐。
      const hash = slugger.slug(title);
      flush();
      // h1 是文档标题，本身不作为可跳转的小节。
      if (match[1].length === 1) {
        heading = null;
        continue;
      }
      heading = title;
      headingHash = hash;
      continue;
    }

    // 丢弃 JSX 组件标签行，保留其中的文字内容。
    if (/^\s*<\/?[A-Z][\w.]*/.test(line)) continue;

    buffer.push(line);
  }

  flush();
  return sections;
}

export function buildSearchIndex() {
  const records = [];

  const articles = readdirSync(TOPICS_DIR, { recursive: true, encoding: 'utf8' })
    .filter(entry => entry.endsWith('article.mdx'))
    .sort();

  for (const entry of articles) {
    const [chapter, slug] = entry.replace(/\\/g, '/').split('/');
    const source = readFileSync(join(TOPICS_DIR, entry), 'utf8');

    for (const section of extractSections(source)) {
      records.push({ slug, chapter, ...section });
    }
  }

  return records;
}

export function writeSearchIndex() {
  const records = buildSearchIndex();
  mkdirSync(dirname(OUTPUT), { recursive: true });
  writeFileSync(OUTPUT, JSON.stringify(records), 'utf8');
  return records;
}

// 直接执行时写盘，便于在 vitest / 构建之外手动重建。
if (process.argv[1] && process.argv[1].endsWith('build-search-index.mjs')) {
  const records = writeSearchIndex();
  const bytes = JSON.stringify(records).length;
  process.stdout.write(`搜索索引：${records.length} 条记录，${(bytes / 1024).toFixed(1)} KB\n`);
}
