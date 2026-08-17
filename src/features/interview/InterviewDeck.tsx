import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { chapters } from '../../content/chapters';
import type { TopicLevel } from '../../content/types';
import { topicPath } from '../../app/paths';
import {
  filterQuestions,
  selectRandomQuestion,
} from './questionBank';
import type { InterviewQuestion } from './questionBank';

const levels: TopicLevel[] = ['基础', '高频', '进阶'];

type InterviewDeckProps = {
  questions: InterviewQuestion[];
  durationSeconds?: number;
  random?: () => number;
};

export default function InterviewDeck({
  questions,
  durationSeconds = 90,
  random = Math.random,
}: InterviewDeckProps) {
  const [chapter, setChapter] = useState('');
  const [level, setLevel] = useState<TopicLevel | ''>('');
  const [currentSlug, setCurrentSlug] = useState(questions[0]?.slug ?? '');
  const [remaining, setRemaining] = useState(durationSeconds);
  const [revealed, setRevealed] = useState(false);

  const filtered = useMemo(() => filterQuestions(questions, {
    chapter: chapter || undefined,
    level: level || undefined,
  }), [chapter, level, questions]);

  const current = filtered.find(question => question.slug === currentSlug) ?? filtered[0];

  useEffect(() => {
    setRemaining(durationSeconds);
    setRevealed(false);
  }, [current?.slug, durationSeconds]);

  useEffect(() => {
    if (!current || revealed) return;

    const timer = window.setInterval(() => {
      setRemaining(seconds => Math.max(0, seconds - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [current, revealed]);

  const resetSelection = () => {
    setCurrentSlug('');
    setRemaining(durationSeconds);
    setRevealed(false);
  };

  const nextQuestion = () => {
    if (!current || !filtered.length) return;
    const next = selectRandomQuestion(filtered, random, current.slug);
    setCurrentSlug(next.slug);
    setRemaining(durationSeconds);
    setRevealed(false);
  };

  return (
    <section className="interview-deck" aria-labelledby="interview-question">
      <div className="interview-filters">
        <label>
          章节筛选
          <select
            value={chapter}
            onChange={event => {
              setChapter(event.target.value);
              resetSelection();
            }}
          >
            <option value="">全部章节</option>
            {chapters
              .filter(item => questions.some(question => question.chapter === item.id))
              .map(item => (
                <option key={item.id} value={item.id}>{item.title}</option>
              ))}
          </select>
        </label>

        <label>
          难度筛选
          <select
            value={level}
            onChange={event => {
              setLevel(event.target.value as TopicLevel | '');
              resetSelection();
            }}
          >
            <option value="">全部难度</option>
            {levels.map(item => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
      </div>

      {current ? (
        <article>
          <header>
            <p>{current.level} · 90 SECOND ANSWER</p>
            <p aria-live="polite">剩余 {remaining} 秒</p>
            <h2 id="interview-question">{current.prompt}</h2>
          </header>

          <div>
            {!revealed ? (
              <button type="button" onClick={() => setRevealed(true)}>
                显示参考答案
              </button>
            ) : (
              <section aria-labelledby="reference-answer">
                <h3 id="reference-answer">参考答案</h3>
                <p>{current.answer}</p>
                <h3>继续追问</h3>
                <ol>
                  {current.followUps.map(question => <li key={question}>{question}</li>)}
                </ol>
              </section>
            )}
          </div>

          <footer>
            <Link to={topicPath(current)}>打开完整专题</Link>
            <button type="button" onClick={nextQuestion}>下一题</button>
          </footer>
        </article>
      ) : (
        <p>当前筛选条件下没有题目。</p>
      )}
    </section>
  );
}
