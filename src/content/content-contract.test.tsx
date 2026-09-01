import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen } from '@testing-library/react';
import { MDXProvider } from '@mdx-js/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test } from 'vitest';
import { mdxComponents } from '../mdx-components';
import { topicPath } from '../app/paths';
import { topicCatalog } from './catalog';
import { chapters } from './chapters';
import searchIndex from '../generated/search-index.json';
import { getTopic, loadTopic, topics } from './registry';
import { validatePractices } from './validate';
import type { TopicPractice } from './types';

// 运行时按需加载 practice.ts，这里只在测试中 eager 载入以便一次性校验全部专题。
const practices = Object.values(
  import.meta.glob<{ practice: TopicPractice }>('./topics/**/practice.ts', { eager: true }),
).map(module => module.practice);

// MDX 插件会在 ?raw 之前处理 .mdx，拿不到原文，因此直接读盘。
const topicsDir = join(process.cwd(), 'src/content/topics');

const articleSources: Record<string, string> = Object.fromEntries(
  readdirSync(topicsDir, { recursive: true, encoding: 'utf8' })
    .filter((entry: string) => entry.endsWith('article.mdx'))
    .map((entry: string) => [
      entry.replace(/\\/g, '/'),
      readFileSync(join(topicsDir, entry), 'utf8'),
    ]),
);

const requiredHeadings = [
  '一句话结论',
  '前置知识',
  '核心机制',
  '项目应用',
  '边界与反例',
  '面试回答',
  '深度追问',
  '关联专题',
  '资料来源',
];

describe('phase-one content contract', () => {
  test('keeps the lightweight catalog synchronized with the registry', () => {
    expect(topicCatalog).toEqual(topics.map(topic => ({
      slug: topic.slug,
      chapter: topic.chapter,
      title: topic.title,
      level: topic.level,
      minutes: topic.minutes,
    })));
  });

  test('every chapter ships at least one topic', () => {
    const empty = chapters
      .filter(chapter => !topics.some(topic => topic.chapter === chapter.id))
      .map(chapter => `${chapter.index} ${chapter.title}`);

    expect(empty, '章节页没有任何专题时读者会走进空页面').toEqual([]);
  });

  test('ships a valid practice file for every topic', () => {
    expect(validatePractices(topics, practices).map(issue => issue.message)).toEqual([]);
  });

  test('uses valid topic relationships and HTTPS sources', () => {
    const slugs = new Set(topics.map(topic => topic.slug));

    for (const topic of topics) {
      expect(topic.sources.length).toBeGreaterThan(0);
      expect(topic.sources.every(source => source.href.startsWith('https://'))).toBe(true);
      expect(topic.prerequisites.every(slug => slugs.has(slug))).toBe(true);
      expect(topic.related.every(slug => slugs.has(slug))).toBe(true);
    }
  });

  test('imports every article and renders all required sections', async () => {
    for (const topic of topics) {
      const Article = (await loadTopic(topic.slug)).default;
      const view = render(
        <MemoryRouter>
          <MDXProvider components={mdxComponents}>
            <Article />
          </MDXProvider>
        </MemoryRouter>,
      );
      const headings = [...view.container.querySelectorAll('h2')]
        .map(heading => heading.textContent?.trim());

      for (const required of requiredHeadings) {
        expect(headings, `${topic.slug} 缺少章节：${required}`).toContain(required);
      }

      view.unmount();
    }
  });

  test('search index anchors match the ids rehype-slug actually renders', async () => {
    const byTopic = new Map<string, Set<string>>();
    for (const record of searchIndex as Array<{ slug: string; hash: string }>) {
      const set = byTopic.get(record.slug) ?? new Set<string>();
      set.add(record.hash);
      byTopic.set(record.slug, set);
    }

    // 深链依赖锚点与渲染结果完全一致，这里逐篇比对而不是抽查。
    for (const topic of topics) {
      const Article = (await loadTopic(topic.slug)).default;
      const view = render(
        <MemoryRouter>
          <MDXProvider components={mdxComponents}>
            <Article />
          </MDXProvider>
        </MemoryRouter>,
      );

      const rendered = new Set(
        [...view.container.querySelectorAll('[id]')].map(node => node.id),
      );

      for (const hash of byTopic.get(topic.slug) ?? []) {
        expect(rendered, `${topic.slug} 缺少锚点 #${hash}`).toContain(hash);
      }

      view.unmount();
    }
  });

  test('every in-article /topics/ cross reference points at a real topic', () => {
    const broken: string[] = [];

    for (const [path, source] of Object.entries(articleSources)) {
      for (const match of source.matchAll(/\]\(\/topics\/([^)#?]+)/g)) {
        if (!getTopic(match[1])) broken.push(`${path} → /topics/${match[1]}`);
      }
    }

    expect(broken, '正文互链指向不存在的专题').toEqual([]);
  });

  test('renders cross references as real handbook routes, not /topics/', async () => {
    const source = Object.values(articleSources)
      .find(text => /\]\(\/topics\//.test(text));
    expect(source, '至少要有一篇文章包含站内互链').toBeDefined();

    const slug = /\]\(\/topics\/([^)#?]+)/.exec(source!)![1];
    const target = getTopic(slug)!;
    const key = Object.keys(articleSources)
      .find(entry => articleSources[entry] === source)!
      .replace('/article.mdx', '');
    const owner = topics.find(topic => `${topic.chapter}/${topic.slug}` === key)!;

    const Article = (await loadTopic(owner.slug)).default;
    const view = render(
      <MemoryRouter>
        <MDXProvider components={mdxComponents}>
          <Article />
        </MDXProvider>
      </MemoryRouter>,
    );

    const link = screen.getAllByRole('link', { name: new RegExp(target.title) })[0];
    expect(link).toHaveAttribute('href', topicPath(target));
    expect(link.getAttribute('href')).not.toContain('/topics/');
    view.unmount();
  });
});
