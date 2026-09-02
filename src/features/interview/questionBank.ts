import type { TopicLevel, TopicMeta, TopicPractice } from '../../content/types';

/** 主问题考的是整体表达，追问考的是某一个具体机制。 */
export type InterviewQuestionKind = 'main' | 'follow-up';

export type InterviewQuestion = {
  /** 主问题用 slug，追问用 `slug#序号`，用于轮转与掌握度记录。 */
  id: string;
  slug: string;
  chapter: string;
  level: TopicLevel;
  title: string;
  kind: InterviewQuestionKind;
  prompt: string;
  answer: string;
  /** 答案是否来自作者手写的正文，false 表示只能给出参考方向。 */
  answered: boolean;
};

export type QuestionFilters = {
  chapter?: string;
  level?: TopicLevel;
  /** 只出还没标记为掌握的题。 */
  unmasteredOnly?: boolean;
  masteredIds?: readonly string[];
};

export type FollowUpRecord = { question: string; answer: string };

/** slug → 正文「深度追问」里抽取出的问答对。 */
export type FollowUpIndex = Record<string, FollowUpRecord[]>;

/**
 * 索引由调用方传入而不是在这里静态 import：路由表把页面组件全部静态导入，
 * 模块级的 import 会把这份 19KB JSON 打进首屏包，构建预算会直接拦下来。
 * /interview 在自己的惰性边界里动态加载它。
 */
export function loadFollowUpIndex(): Promise<FollowUpIndex> {
  return import('../../generated/interview-index.json')
    .then(module => module.default as FollowUpIndex);
}

/**
 * 主问题的措辞按难度分档。
 *
 * 以前所有题面都是 `请解释：${标题}`，50 道题读起来完全一样；真实面试里
 * 基础题、高频题和进阶题的问法本来就不同，这里至少把这层区分还原出来。
 */
const mainPrompts: Record<TopicLevel, (title: string) => string> = {
  基础: title => `请解释「${title}」，以及它解决的是什么问题。`,
  高频: title => `面试官让你讲讲「${title}」，你会怎么组织这段回答？`,
  进阶: title => `围绕「${title}」，说说它的机制、边界，以及你在项目里的取舍。`,
};

/** 题面来自 meta 与正文，答案来自按需加载的 practice；没有 practice 的专题不出题。 */
export function deriveQuestions(
  source: TopicMeta[],
  practices: TopicPractice[],
  followUps: FollowUpIndex = {},
): InterviewQuestion[] {
  const bySlug = new Map(practices.map(practice => [practice.slug, practice]));

  return source.flatMap(topic => {
    const practice = bySlug.get(topic.slug);
    if (!practice) return [];

    const base = {
      slug: topic.slug,
      chapter: topic.chapter,
      level: topic.level,
      title: topic.title,
    };

    const main: InterviewQuestion = {
      ...base,
      id: topic.slug,
      kind: 'main',
      prompt: mainPrompts[topic.level](topic.title),
      answer: practice.interview.answer,
      answered: true,
    };

    // 正文「深度追问」里成对的问答优先；解析不出问答对的专题退回 practice
    // 里手写的 followUps，此时只能给出本专题的结论作为参考方向。
    const extracted = followUps[topic.slug] ?? [];
    const derivedFollowUps: InterviewQuestion[] = extracted.length
      ? extracted.map((record, index) => ({
        ...base,
        id: `${topic.slug}#${index}`,
        kind: 'follow-up' as const,
        prompt: record.question,
        answer: record.answer,
        answered: true,
      }))
      : practice.interview.followUps.map((prompt, index) => ({
        ...base,
        id: `${topic.slug}#${index}`,
        kind: 'follow-up' as const,
        prompt,
        answer: practice.interview.answer,
        answered: false,
      }));

    return [main, ...derivedFollowUps];
  });
}

export function filterQuestions(
  questions: InterviewQuestion[],
  filters: QuestionFilters,
): InterviewQuestion[] {
  const mastered = new Set(filters.masteredIds ?? []);

  return questions.filter(question => {
    if (filters.chapter && question.chapter !== filters.chapter) return false;
    if (filters.level && question.level !== filters.level) return false;
    if (filters.unmasteredOnly && mastered.has(question.id)) return false;
    return true;
  });
}

/**
 * 把题目打乱成一轮队列。
 *
 * 以前每次「下一题」都独立随机、只避开上一题，刷十分钟就会反复撞见同一道；
 * 改成先洗牌再顺序发牌，一轮之内不重复，发完再洗下一轮。
 */
export function shuffleQuestions(
  questions: InterviewQuestion[],
  random: () => number = Math.random,
): InterviewQuestion[] {
  const deck = [...questions];

  for (let index = deck.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [deck[index], deck[swap]] = [deck[swap], deck[index]];
  }

  return deck;
}
