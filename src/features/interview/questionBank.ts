import type { TopicLevel, TopicMeta } from '../../content/types';

export type InterviewQuestion = {
  slug: string;
  chapter: string;
  level: TopicLevel;
  title: string;
  prompt: string;
  answer: string;
  followUps: string[];
};

export type QuestionFilters = {
  chapter?: string;
  level?: TopicLevel;
};

export function deriveQuestions(source: TopicMeta[]): InterviewQuestion[] {
  return source.map(topic => ({
    slug: topic.slug,
    chapter: topic.chapter,
    level: topic.level,
    title: topic.title,
    prompt: `请解释：${topic.title}`,
    answer: topic.interview.answer,
    followUps: topic.interview.followUps,
  }));
}

export function filterQuestions(
  questions: InterviewQuestion[],
  filters: QuestionFilters,
) {
  return questions.filter(question =>
    (!filters.chapter || question.chapter === filters.chapter) &&
    (!filters.level || question.level === filters.level),
  );
}

export function selectRandomQuestion(
  questions: InterviewQuestion[],
  random: () => number = Math.random,
  currentSlug?: string,
): InterviewQuestion {
  if (!questions.length) throw new Error('题库为空');

  const alternatives = questions.filter(question => question.slug !== currentSlug);
  const candidates = alternatives.length ? alternatives : questions;
  const sample = Math.max(0, Math.min(random(), 0.999999));
  return candidates[Math.floor(sample * candidates.length)];
}
