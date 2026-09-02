import { describe, expect, test } from 'vitest';
import followUpIndex from '../generated/interview-index.json';
import {
  deriveQuestions,
  filterQuestions,
  loadFollowUpIndex,
} from '../features/interview/questionBank';
import { loadAllPractices, topics } from './registry';

const index = followUpIndex as Record<string, { question: string; answer: string }[]>;
const slugs = new Set(topics.map(topic => topic.slug));

/*
  /interview 的题面曾经全部是 `请解释：${标题}` 拼出来的，50 篇专题长着同一
  张脸。现在题目来自正文「深度追问」小节的构建期抽取，这组断言盯住那条管线：
  抽取一旦失效（比如正则把小节截断成空），题库会静默退回模板，只有测试能发现。
*/
describe('interview follow-up index', () => {
  test('covers most topics with real question and answer pairs', () => {
    const covered = Object.keys(index);
    const pairs = Object.values(index).flat();

    expect(covered.length).toBeGreaterThanOrEqual(Math.floor(topics.length * 0.7));
    expect(pairs.length).toBeGreaterThanOrEqual(100);
  });

  test('only references topics that exist', () => {
    for (const slug of Object.keys(index)) {
      expect(slugs, `追问索引指向未知专题：${slug}`).toContain(slug);
    }
  });

  test('every extracted pair carries both halves', () => {
    for (const [slug, pairs] of Object.entries(index)) {
      for (const pair of pairs) {
        expect(pair.question.trim(), `${slug} 的追问缺少问题`).not.toBe('');
        expect(pair.answer.trim(), `${slug} 的追问缺少答案`).not.toBe('');
        // 抽取到的应该是问题，不是被截断的正文段落。
        expect(pair.question, `${slug} 的追问不像问句：${pair.question}`)
          .toMatch(/[?？]$/);
        expect(pair.question.length, `${slug} 的追问过长，可能截错了`)
          .toBeLessThan(80);
        // 加粗标记应当已经被剥掉。
        expect(pair.question).not.toContain('**');
        expect(pair.answer).not.toContain('**');
      }
    }
  });

  test('produces a bank larger than one question per topic', async () => {
    const questions = deriveQuestions(
      topics,
      await loadAllPractices(),
      await loadFollowUpIndex(),
    );

    expect(questions.length).toBeGreaterThan(topics.length * 2);
    expect(filterQuestions(questions, { chapter: 'javascript-async' }).length)
      .toBeGreaterThan(0);

    // 每篇专题至少出一道主问题，id 全局唯一。
    const ids = questions.map(question => question.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(questions.filter(question => question.kind === 'main'))
      .toHaveLength(topics.length);
  });
});
