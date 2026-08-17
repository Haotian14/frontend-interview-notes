import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { topics } from '../../content/registry';
import InterviewDeck from './InterviewDeck';
import {
  deriveQuestions,
  filterQuestions,
  selectRandomQuestion,
} from './questionBank';

afterEach(() => {
  vi.useRealTimers();
});

describe('interview question bank', () => {
  const questions = deriveQuestions(topics);

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

  test('selects deterministically and avoids the current question', () => {
    const current = questions[0];
    if (!current) throw new Error('测试需要题目');

    const next = selectRandomQuestion(questions, () => 0.5, current.slug);
    expect(next.slug).not.toBe(current.slug);
  });
});

describe('InterviewDeck', () => {
  const questions = deriveQuestions(topics).slice(0, 3);

  test('counts down and reveals the answer', () => {
    vi.useFakeTimers();
    const current = questions[0];
    if (!current) throw new Error('测试需要题目');

    render(
      <MemoryRouter>
        <InterviewDeck questions={questions} durationSeconds={3} random={() => 0.5} />
      </MemoryRouter>,
    );

    expect(screen.getByText('剩余 3 秒')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByText('剩余 2 秒')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '显示参考答案' }));
    expect(screen.getByText(current.answer)).toBeInTheDocument();
  });

  test('resets the timer and hides the answer for the next question', () => {
    vi.useFakeTimers();
    const current = questions[0];
    if (!current) throw new Error('测试需要题目');

    render(
      <MemoryRouter>
        <InterviewDeck questions={questions} durationSeconds={5} random={() => 0.5} />
      </MemoryRouter>,
    );

    act(() => vi.advanceTimersByTime(2000));
    fireEvent.click(screen.getByRole('button', { name: '显示参考答案' }));
    expect(screen.getByText(current.answer)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '下一题' }));

    expect(screen.getByText('剩余 5 秒')).toBeInTheDocument();
    expect(screen.queryByText(current.answer)).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 }).textContent)
      .not.toContain(current.title);
  });

  test('offers accessible chapter and level filters', () => {
    render(
      <MemoryRouter>
        <InterviewDeck questions={deriveQuestions(topics)} />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByRole('combobox', { name: '章节筛选' }), {
      target: { value: 'browser-network' },
    });
    fireEvent.change(screen.getByRole('combobox', { name: '难度筛选' }), {
      target: { value: '高频' },
    });

    expect(screen.getByText(/浏览器渲染流水线|HTTP 缓存与重新验证/))
      .toBeInTheDocument();
  });
});
