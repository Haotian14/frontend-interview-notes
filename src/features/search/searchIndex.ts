import Fuse from 'fuse.js';
import { topics } from '../../content/registry';
import type { TopicMeta } from '../../content/types';

export function createSearchIndex(source: TopicMeta[]) {
  return new Fuse(source, {
    includeMatches: true,
    includeScore: true,
    threshold: 0.35,
    ignoreLocation: true,
    keys: [
      { name: 'title', weight: 0.45 },
      { name: 'keywords', weight: 0.25 },
      { name: 'summary', weight: 0.2 },
      { name: 'searchText', weight: 0.1 },
    ],
  });
}

let topicSearchIndex: ReturnType<typeof createSearchIndex> | undefined;

export function searchTopics(query: string) {
  const normalized = query.trim();
  if (!normalized) return [];

  topicSearchIndex ??= createSearchIndex(topics);
  return topicSearchIndex.search(normalized);
}
