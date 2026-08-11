import { describe, expect, test } from 'vitest';
import { getAdjacentTopics, getChapterTopics, getTopic, loadTopic, topics } from './registry';

describe('content registry', () => {
  test('registers the event loop topic', () => {
    expect(getTopic('event-loop')?.title).toBe('事件循环与任务队列');
    expect(getChapterTopics('javascript-async')).toHaveLength(1);
    expect(topics).toHaveLength(1);
  });

  test('loads the MDX module lazily', async () => {
    const module = await loadTopic('event-loop');
    expect(module.default).toBeTypeOf('function');
  });

  test('returns adjacent topics without throwing at boundaries', () => {
    expect(getAdjacentTopics('event-loop')).toEqual({ previous: undefined, next: undefined });
  });
});
