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
});
