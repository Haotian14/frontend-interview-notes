import { describe, expect, test } from 'vitest';
import {
  CODE_PATH,
  HANDBOOK_PATH,
  HOME_PATH,
  INTERVIEW_PATH,
  KNOWLEDGE_MAP_PATH,
  REFERENCE_PATH,
  chapterPath,
  topicPath,
} from './paths';

describe('route paths', () => {
  test('exports stable top-level paths', () => {
    expect({
      home: HOME_PATH,
      handbook: HANDBOOK_PATH,
      map: KNOWLEDGE_MAP_PATH,
      interview: INTERVIEW_PATH,
      code: CODE_PATH,
      reference: REFERENCE_PATH,
    }).toEqual({
      home: '/',
      handbook: '/handbook',
      map: '/knowledge-map',
      interview: '/interview',
      code: '/code',
      reference: '/reference',
    });
  });

  test('builds chapter and topic paths', () => {
    expect(chapterPath('javascript-async')).toBe('/handbook/javascript-async');
    expect(topicPath({ chapter: 'javascript-async', slug: 'event-loop' }))
      .toBe('/handbook/javascript-async/event-loop');
  });

  test('encodes unsafe path characters', () => {
    expect(chapterPath('css layout')).toBe('/handbook/css%20layout');
    expect(topicPath({ chapter: 'browser/network', slug: 'http cache' }))
      .toBe('/handbook/browser%2Fnetwork/http%20cache');
  });
});
