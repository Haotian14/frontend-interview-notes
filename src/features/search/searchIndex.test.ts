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

  test('matches words that only appear in article body, not in metadata', () => {
    // 「游离」只出现在 closures-scope 的正文，meta 的任何字段里都没有。
    const results = searchTopics('游离');
    const hit = results.find(result => result.item.slug === 'closures-scope');

    expect(hit, '正文关键词应当可被检索到').toBeDefined();
    expect(hit!.section?.heading).toBeTruthy();
    expect(hit!.section?.excerpt).toContain('游离');
  });

  test('body hits carry a section anchor for deep linking', () => {
    const hit = searchTopics('游离').find(result => result.item.slug === 'closures-scope');

    expect(hit!.section?.hash).toBeTruthy();
    // 锚点要能直接拼进 URL。
    expect(hit!.section!.hash).not.toContain(' ');
    expect(hit!.section!.hash).toBe(hit!.section!.hash.trim());
  });

  test('metadata matches still outrank body-only matches', () => {
    const results = searchTopics('防抖');
    expect(results[0]?.item.slug).toBe('debounce-throttle');
  });

  test('metadata matches open the topic itself, without a section anchor', () => {
    // 「缓存」命中 http-cache 的关键词；这类查询要的是整篇专题，
    // 不该把人直接丢到正文中段。
    const hit = searchTopics('缓存').find(result => result.item.slug === 'http-cache');

    expect(hit).toBeDefined();
    expect(hit!.section).toBeUndefined();
  });
});
