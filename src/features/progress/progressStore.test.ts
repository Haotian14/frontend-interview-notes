import { beforeEach, describe, expect, test } from 'vitest';
import {
  clearProgress,
  readProgress,
  toggleMastered,
  toggleRead,
  writeProgress,
} from './progressStore';

describe('progressStore', () => {
  beforeEach(() => {
    clearProgress();
  });

  test('returns an empty state when nothing has been stored', () => {
    expect(readProgress()).toEqual({ read: [], mastered: [] });
  });

  test('round-trips read topics', () => {
    writeProgress({ read: ['event-loop', 'closures-scope'], mastered: [] });
    expect(readProgress().read).toEqual(['event-loop', 'closures-scope']);
  });

  test('round-trips mastered question ids', () => {
    writeProgress({ read: [], mastered: ['event-loop', 'event-loop#1'] });
    expect(readProgress().mastered).toEqual(['event-loop', 'event-loop#1']);
  });

  test('toggles a slug on and off', () => {
    const first = toggleRead({ read: [], mastered: [] }, 'event-loop');
    expect(first.read).toEqual(['event-loop']);

    const second = toggleRead(first, 'event-loop');
    expect(second.read).toEqual([]);
  });

  test('toggling one list leaves the other untouched', () => {
    const withRead = toggleRead({ read: [], mastered: [] }, 'event-loop');
    const withBoth = toggleMastered(withRead, 'event-loop#1');

    expect(withBoth).toEqual({ read: ['event-loop'], mastered: ['event-loop#1'] });
    expect(toggleMastered(withBoth, 'event-loop#1').read).toEqual(['event-loop']);
  });

  test('survives corrupted storage instead of throwing', () => {
    window.localStorage.setItem('handbook:progress:v1', 'not json at all');
    expect(readProgress()).toEqual({ read: [], mastered: [] });

    window.localStorage.setItem('handbook:progress:v1', '{"read":"nope"}');
    expect(readProgress()).toEqual({ read: [], mastered: [] });

    window.localStorage.setItem('handbook:progress:v1', '{"read":[1,"ok",null]}');
    expect(readProgress().read).toEqual(['ok']);
  });

  // mastered 是后加的字段：旧版本存下的数据里没有它，不该整份作废。
  test('reads pre-mastery records without dropping progress', () => {
    window.localStorage.setItem('handbook:progress:v1', '{"read":["event-loop"]}');
    expect(readProgress()).toEqual({ read: ['event-loop'], mastered: [] });
  });

  test('clearProgress removes the stored entry', () => {
    writeProgress({ read: ['event-loop'], mastered: [] });
    clearProgress();
    expect(readProgress()).toEqual({ read: [], mastered: [] });
  });
});
