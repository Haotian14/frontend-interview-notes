import { describe, expect, test } from 'vitest';
import { searchTopics } from './searchIndex';

describe('weighted topic search', () => {
  test('ranks title matches above body and summary matches', () => {
    const results = searchTopics('事件循环');
    expect(results[0]?.item.slug).toBe('event-loop');
  });

  test('returns an empty result for blank input', () => {
    expect(searchTopics('   ')).toEqual([]);
  });

  test('finds several rendering topics without loading article modules', () => {
    const slugs = searchTopics('渲染').map(result => result.item.slug);
    expect(slugs).toContain('rendering-pipeline');
    expect(slugs).toContain('event-loop');
  });
});
