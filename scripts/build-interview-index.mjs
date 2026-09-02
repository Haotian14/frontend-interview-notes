/**
 * 从 article.mdx 的「深度追问」小节提取真实的追问问答。
 *
 * 在这之前，/interview 的题面全部是 `请解释：${标题}` 拼出来的模板，50 篇专题
 * 长着同一张脸；而每篇正文里其实都写了 2—3 组作者手写的追问和答案。这个脚本
 * 把它们变成结构化题目，让题库既有真实措辞，也有可核对的参考答案。
 *
 * 约定的写法是有序列表加粗问题、其后是答案：
 *
 *     1. **为什么微任务会饿死渲染？** 因为微任务检查点会……
 *
 * 不符合这个写法的小节（例如把问题和答案分成两段写）不会被硬套格式，
 * 而是整段留空，由 practice.ts 里的 followUps 兜底。
 */
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { stripInline } from './build-search-index.mjs';

const TOPICS_DIR = join(process.cwd(), 'src/content/topics');
const OUTPUT = join(process.cwd(), 'src/generated/interview-index.json');

const HEADING = '深度追问';
const ITEM = /^\s*\d+\.\s+\*\*(.+?)\*\*\s*(.*)$/;

/**
 * 把「深度追问」小节切成问答对；答案允许跨行，直到下一个编号项或空行。
 *
 * 这里按二级标题切分而不是用一条带前后视的正则：`$` 在 /m 下匹配的是行尾
 * 而不是文本结尾，写成 `(?=^## |$)` 会在小节第一行就截断。
 */
export function extractFollowUps(source) {
  const body = source
    .split(/^## /m)
    .find(part => part.startsWith(HEADING))
    ?.slice(HEADING.length);

  if (!body) return [];

  const pairs = [];
  let current = null;

  const flush = () => {
    if (!current) return;
    const answer = stripInline(current.answer.join(' ')).trim();
    const question = stripInline(current.question).trim();
    // 只收录问答俱全的条目：没有答案的题目在训练场里没有价值。
    if (question && answer) pairs.push({ question, answer });
    current = null;
  };

  for (const line of body.split(/\r?\n/)) {
    const item = ITEM.exec(line);

    if (item) {
      flush();
      current = { question: item[1], answer: [item[2]] };
      continue;
    }

    if (!line.trim()) {
      flush();
      continue;
    }

    // 编号项之外的散文（例如结尾的「继续追问时还可以讨论……」）不算答案。
    if (current) current.answer.push(line);
  }

  flush();
  return pairs;
}

export function buildInterviewIndex() {
  const index = {};

  const articles = readdirSync(TOPICS_DIR, { recursive: true, encoding: 'utf8' })
    .filter(entry => entry.endsWith('article.mdx'))
    .sort();

  for (const entry of articles) {
    const [, slug] = entry.replace(/\\/g, '/').split('/');
    const pairs = extractFollowUps(readFileSync(join(TOPICS_DIR, entry), 'utf8'));
    if (pairs.length) index[slug] = pairs;
  }

  return index;
}

export function writeInterviewIndex() {
  const index = buildInterviewIndex();
  mkdirSync(dirname(OUTPUT), { recursive: true });
  writeFileSync(OUTPUT, JSON.stringify(index), 'utf8');
  return index;
}

if (process.argv[1] && process.argv[1].endsWith('build-interview-index.mjs')) {
  const index = writeInterviewIndex();
  const count = Object.values(index).reduce((total, pairs) => total + pairs.length, 0);
  const bytes = JSON.stringify(index).length;
  process.stdout.write(
    `追问索引：${Object.keys(index).length} 篇专题，${count} 组问答，${(bytes / 1024).toFixed(1)} KB\n`,
  );
}
