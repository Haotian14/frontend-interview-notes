import { beforeEach, describe, expect, test } from 'vitest';
import {
  clearProgress,
  readProgress,
  toggleRead,
  writeProgress,
} from './progressStore';

describe('progressStore', () => {
  beforeEach(() => {
    clearProgress();
  });

  test('returns an empty state when nothing has been stored', () => {
    expect(readProgress()).toEqual({ read: [] });
  });

  test('round-trips read topics', () => {
    writeProgress({ read: ['event-loop', 'closures-scope'] });
    expect(readProgress().read).toEqual(['event-loop', 'closures-scope']);
  });

  test('toggles a slug on and off', () => {
    const first = toggleRead({ read: [] }, 'event-loop');
    expect(first.read).toEqual(['event-loop']);

    const second = toggleRead(first, 'event-loop');
    expect(second.read).toEqual([]);
  });

  test('survives corrupted storage instead of throwing', () => {
    window.localStorage.setItem('handbook:progress:v1', 'not json at all');
    expect(readProgress()).toEqual({ read: [] });

    window.localStorage.setItem('handbook:progress:v1', '{"read":"nope"}');
    expect(readProgress()).toEqual({ read: [] });

    window.localStorage.setItem('handbook:progress:v1', '{"read":[1,"ok",null]}');
    expect(readProgress().read).toEqual(['ok']);
  });

  test('clearProgress removes the stored entry', () => {
    writeProgress({ read: ['event-loop'] });
    clearProgress();
    expect(readProgress()).toEqual({ read: [] });
  });
});
