import { describe, expect, test } from 'vitest';
import { getAdjacentTopics, getChapterTopics, getTopic, loadTopic, topics } from './registry';

describe('content registry', () => {
  test('registers the first four sample topics', () => {
    expect(topics.map(topic => topic.slug)).toEqual(expect.arrayContaining([
      'semantic-accessibility',
      'stacking-context',
      'event-loop',
      'type-narrowing',
    ]));
    expect(topics).toHaveLength(4);
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
    expect(getAdjacentTopics('semantic-accessibility').previous).toBeUndefined();
    expect(getAdjacentTopics('type-narrowing').next).toBeUndefined();
  });
});
