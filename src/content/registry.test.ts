import { describe, expect, test } from 'vitest';
import { chapters } from './chapters';
import { getAdjacentTopics, getChapterTopics, getTopic, loadTopic, topics } from './registry';

describe('content registry', () => {
  test('orders topics by chapter index then in-chapter order', () => {
    const rank = (slug: string) => {
      const topic = getTopic(slug)!;
      const chapter = chapters.find(item => item.id === topic.chapter)!;
      return [chapter.index, topic.order] as const;
    };

    const ranks = topics.map(topic => rank(topic.slug));
    const sorted = [...ranks].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(ranks).toEqual(sorted);
  });

  test('registers the event loop topic', () => {
    expect(getTopic('event-loop')?.title).toBe('事件循环与任务队列');
    expect(getChapterTopics('javascript-async')).toHaveLength(1);
  });

  test('loads the MDX module lazily', async () => {
    const module = await loadTopic('event-loop');
    expect(module.default).toBeTypeOf('function');
  });

  test('returns adjacent topics without throwing at boundaries', () => {
    expect(getAdjacentTopics(topics[0].slug).previous).toBeUndefined();
    expect(getAdjacentTopics(topics.at(-1)!.slug).next).toBeUndefined();
    expect(getAdjacentTopics(topics[0].slug).next?.slug).toBe(topics[1].slug);
  });
});
