import { describe, expect, test } from 'vitest';
import { validateContent } from './validate';
import type { Chapter, TopicMeta } from './types';

const chapters: Chapter[] = [
  { id: 'javascript', index: 3, title: 'JavaScript 语言核心', summary: '语言机制' },
];

const validTopic: TopicMeta = {
  slug: 'scope-closure',
  chapter: 'javascript',
  order: 1,
  title: '作用域与闭包',
  summary: '理解词法环境与闭包。',
  level: '高频',
  minutes: 18,
  keywords: ['作用域', '闭包'],
  prerequisites: [],
  related: [],
  sources: [{ label: 'MDN Closures', href: 'https://developer.mozilla.org/docs/Web/JavaScript/Guide/Closures' }],
  searchText: '词法作用域 环境记录 私有状态',
  hasCode: true,
  code: {
    input: '在循环里用 var 和 let 分别捕获索引并延迟输出。',
    output: 'var 版本全部输出同一个终值，let 版本每轮各自绑定。',
  },
  interview: {
    answer: '闭包让函数保留定义时的词法环境。',
    followUps: ['闭包何时被回收？', '闭包一定泄漏吗？'],
  },
};

describe('validateContent', () => {
  test('accepts a complete topic', () => {
    expect(validateContent([validTopic], chapters)).toEqual([]);
  });

  test('reports duplicate slugs, unknown chapters and broken links', () => {
    const broken = {
      ...validTopic,
      chapter: 'missing',
      prerequisites: ['not-found'],
      sources: [],
    };
    const messages = validateContent([validTopic, broken], chapters).map(issue => issue.message);
    expect(messages).toContain('重复专题 slug：scope-closure');
    expect(messages).toContain('未知章节：missing');
    expect(messages).toContain('无效前置专题：not-found');
    expect(messages).toContain('专题 scope-closure 缺少资料来源');
  });

  test('reports duplicate order and incomplete search/interview metadata', () => {
    const second = {
      ...validTopic,
      slug: 'second-topic',
      searchText: '',
      interview: { ...validTopic.interview, followUps: [] },
    };
    const messages = validateContent([validTopic, second], chapters).map(issue => issue.message);
    expect(messages).toContain('章节内顺序重复：javascript:1');
    expect(messages).toContain('专题缺少搜索文本：second-topic');
    expect(messages).toContain('追问数量必须为 2 至 4：second-topic');
  });

  test('keeps hasCode and the code block in sync', () => {
    const missingCode = { ...validTopic, code: undefined };
    expect(validateContent([missingCode], chapters).map(issue => issue.message))
      .toContain('声明 hasCode 但缺少 code 说明：scope-closure');

    const strayCode = { ...validTopic, hasCode: false };
    expect(validateContent([strayCode], chapters).map(issue => issue.message))
      .toContain('hasCode 为 false 却提供了 code 说明：scope-closure');

    const blankCode = { ...validTopic, code: { input: '  ', output: '有输出' } };
    expect(validateContent([blankCode], chapters).map(issue => issue.message))
      .toContain('code 的预期输入与输出都不能为空：scope-closure');
  });

  test('rejects Markdown syntax in fields rendered as plain text', () => {
    const bold = {
      ...validTopic,
      interview: { ...validTopic.interview, answer: '闭包保留了**词法环境**。' },
    };
    expect(validateContent([bold], chapters).map(issue => issue.message))
      .toContain('scope-closure 的 interview.answer 含有 Markdown 语法，该字段按纯文本渲染');

    const link = { ...validTopic, summary: '见[闭包](/topics/closures-scope)。' };
    expect(validateContent([link], chapters).map(issue => issue.message))
      .toContain('scope-closure 的 summary 含有 Markdown 语法，该字段按纯文本渲染');
  });

  test('rejects malformed reference tables', () => {
    const noRows = { ...validTopic, reference: { caption: '速查', rows: [] } };
    expect(validateContent([noRows], chapters).map(issue => issue.message))
      .toContain('速查表至少需要一行：scope-closure');

    const blankRow = {
      ...validTopic,
      reference: { caption: '速查', rows: [{ term: '闭包', meaning: '  ' }] },
    };
    expect(validateContent([blankRow], chapters).map(issue => issue.message))
      .toContain('速查表行缺少概念或判断：scope-closure');

    const noCaption = {
      ...validTopic,
      reference: { caption: ' ', rows: [{ term: '闭包', meaning: '保留词法环境' }] },
    };
    expect(validateContent([noCaption], chapters).map(issue => issue.message))
      .toContain('速查表缺少标题：scope-closure');
  });
});
