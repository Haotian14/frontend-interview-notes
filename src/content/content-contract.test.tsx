import { render } from '@testing-library/react';
import { MDXProvider } from '@mdx-js/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test } from 'vitest';
import { mdxComponents } from '../mdx-components';
import { topicCatalog } from './catalog';
import { loadTopic, topics } from './registry';

const requiredHeadings = [
  '一句话结论',
  '核心机制',
  '项目应用',
  '边界与反例',
  '面试回答',
  '深度追问',
  '资料来源',
];

describe('phase-one content contract', () => {
  test('contains exactly eight sample topics and a synchronized lightweight catalog', () => {
    expect(topics).toHaveLength(8);
    expect(topicCatalog).toEqual(topics.map(topic => ({
      slug: topic.slug,
      chapter: topic.chapter,
      title: topic.title,
      level: topic.level,
      minutes: topic.minutes,
    })));
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
});
