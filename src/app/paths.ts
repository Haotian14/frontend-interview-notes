export const HOME_PATH = '/';
export const HANDBOOK_PATH = '/handbook';
export const KNOWLEDGE_MAP_PATH = '/knowledge-map';
export const INTERVIEW_PATH = '/interview';
export const CODE_PATH = '/code';
export const REFERENCE_PATH = '/reference';

export function chapterPath(chapter: string) {
  return `${HANDBOOK_PATH}/${encodeURIComponent(chapter)}`;
}

export function topicPath(topic: { chapter: string; slug: string }) {
  return `${chapterPath(topic.chapter)}/${encodeURIComponent(topic.slug)}`;
}
