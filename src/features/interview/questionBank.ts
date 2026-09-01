import type { TopicLevel, TopicMeta, TopicPractice } from '../../content/types';

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

/** 题面来自 meta，答案来自按需加载的 practice；没有 practice 的专题不出题。 */
export function deriveQuestions(
  source: TopicMeta[],
  practices: TopicPractice[],
): InterviewQuestion[] {
  const bySlug = new Map(practices.map(practice => [practice.slug, practice]));

  return source.flatMap(topic => {
    const practice = bySlug.get(topic.slug);
    if (!practice) return [];

    return [{
      slug: topic.slug,
      chapter: topic.chapter,
      level: topic.level,
      title: topic.title,
      prompt: `请解释：${topic.title}`,
      answer: practice.interview.answer,
      followUps: practice.interview.followUps,
    }];
  });
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
