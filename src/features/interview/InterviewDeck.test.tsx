import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { loadAllPractices, topics } from '../../content/registry';
import { clearProgress } from '../progress/progressStore';
import InterviewDeck from './InterviewDeck';
import {
  deriveQuestions,
  filterQuestions,
  loadFollowUpIndex,
  shuffleQuestions,
} from './questionBank';

afterEach(() => {
  vi.useRealTimers();
});

beforeEach(() => {
  clearProgress();
});

// practice.ts 是惰性模块，测试里一次性载入后同步使用。
const practices = await loadAllPractices();
const allQuestions = deriveQuestions(topics, practices, await loadFollowUpIndex());

/** 每篇专题会产出主问题和若干追问，取样时按专题去重才能覆盖不同标题。 */
const distinctTopicQuestions = [
  ...new Map(allQuestions.map(question => [question.slug, question])).values(),
];

describe('interview question bank', () => {
  const questions = allQuestions;

  test('filters by chapter and level', () => {
    const filtered = filterQuestions(questions, {
      chapter: 'browser-network',
      level: '高频',
    });

    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every(question =>
      question.chapter === 'browser-network' && question.level === '高频',
    )).toBe(true);
  });

  test('hides questions already marked as mastered', () => {
    const target = questions[0];
    const filtered = filterQuestions(questions, {
      unmasteredOnly: true,
      masteredIds: [target.id],
    });

    expect(filtered).not.toContainEqual(target);
    expect(filtered).toHaveLength(questions.length - 1);
  });

  /*
    题面以前全是 `请解释：${标题}` 拼出来的。这两条断言盯住的是「题库必须
    有真实措辞和多于专题数量的题目」，防止再退回模板。
  */
  test('draws real follow-up questions from the article bodies', () => {
    expect(questions.length).toBeGreaterThan(topics.length);

    const followUps = questions.filter(question => question.kind === 'follow-up');
    expect(followUps.length).toBeGreaterThan(topics.length);

    // 绝大多数追问带有正文里手写的答案，而不是退回专题结论。
    const answered = followUps.filter(question => question.answered);
    expect(answered.length).toBeGreaterThan(followUps.length / 2);
    expect(answered.every(question => question.answer.length > 0)).toBe(true);
  });

  test('varies the main prompt by level instead of one template', () => {
    const mains = questions.filter(question => question.kind === 'main');
    const shapes = new Set(mains.map(question =>
      question.prompt.replace(/「.*?」/, '「」')));

    expect(shapes.size).toBeGreaterThan(1);
    expect(mains.every(question => !question.prompt.startsWith('请解释：'))).toBe(true);
  });

  test('shuffles into a round that uses every question exactly once', () => {
    const pool = questions.slice(0, 12);
    const deck = shuffleQuestions(pool, () => 0.5);

    expect(deck).toHaveLength(pool.length);
    expect(new Set(deck.map(question => question.id)).size).toBe(pool.length);
  });
});

describe('InterviewDeck', () => {
  const questions = distinctTopicQuestions.slice(0, 3);
  // 首轮不洗牌（预渲染 hydrate 要求），所以发牌顺序就是传入顺序。
  const dealt = questions;

  test('counts down and reveals the answer', () => {
    vi.useFakeTimers();

    render(
      <MemoryRouter>
        <InterviewDeck questions={questions} durationSeconds={3} random={() => 0.5} />
      </MemoryRouter>,
    );

    expect(screen.getByText('剩余 3 秒')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByText('剩余 2 秒')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '显示参考答案' }));
    expect(screen.getByText(dealt[0].answer)).toBeInTheDocument();
  });

  test('resets the timer and hides the answer for the next question', () => {
    vi.useFakeTimers();

    render(
      <MemoryRouter>
        <InterviewDeck questions={questions} durationSeconds={5} random={() => 0.5} />
      </MemoryRouter>,
    );

    act(() => vi.advanceTimersByTime(2000));
    fireEvent.click(screen.getByRole('button', { name: '显示参考答案' }));
    expect(screen.getByText(dealt[0].answer)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '下一题' }));

    expect(screen.getByText('剩余 5 秒')).toBeInTheDocument();
    expect(screen.queryByText(dealt[0].answer)).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(dealt[1].prompt);
  });

  test('walks a round without repeating a question', () => {
    render(
      <MemoryRouter>
        <InterviewDeck questions={questions} random={() => 0.5} />
      </MemoryRouter>,
    );

    const seen: string[] = [];
    for (let index = 0; index < questions.length; index += 1) {
      seen.push(screen.getByRole('heading', { level: 2 }).textContent ?? '');
      expect(screen.getByRole('status')).toHaveTextContent(
        `本轮第 ${index + 1} / ${questions.length} 题`,
      );
      fireEvent.click(screen.getByRole('button', { name: '下一题' }));
    }

    expect(new Set(seen).size).toBe(questions.length);
  });

  test('records mastery and can hide mastered questions', () => {
    render(
      <MemoryRouter>
        <InterviewDeck questions={questions} random={() => 0.5} />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: /标记为掌握/ }));
    expect(screen.getByRole('button', { name: /已掌握/ })).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(screen.getByRole('checkbox', { name: '只看未掌握' }));

    expect(screen.getByRole('status')).toHaveTextContent(
      `本轮第 1 / ${questions.length - 1} 题`,
    );
  });

  test('offers accessible chapter and level filters', () => {
    render(
      <MemoryRouter>
        <InterviewDeck questions={allQuestions} random={() => 0.5} />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByRole('combobox', { name: '章节筛选' }), {
      target: { value: 'browser-network' },
    });
    fireEvent.change(screen.getByRole('combobox', { name: '难度筛选' }), {
      target: { value: '高频' },
    });

    const expected = filterQuestions(allQuestions, {
      chapter: 'browser-network',
      level: '高频',
    });
    expect(expected.length).toBeGreaterThan(0);

    // 出的题必须落在筛选范围内。
    const shown = screen.getByRole('heading', { level: 2 }).textContent;
    expect(expected.some(question => question.prompt === shown)).toBe(true);
  });
});
