import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { chapters } from '../../content/chapters';
import type { TopicLevel } from '../../content/types';
import { topicPath } from '../../app/paths';
import { useProgress } from '../progress/useProgress';
import { filterQuestions, shuffleQuestions } from './questionBank';
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
  const [unmasteredOnly, setUnmasteredOnly] = useState(false);
  const [remaining, setRemaining] = useState(durationSeconds);
  const [revealed, setRevealed] = useState(false);
  const { masteredIds, isMastered, toggleMaster } = useProgress();

  const scoped = useMemo(() => filterQuestions(questions, {
    chapter: chapter || undefined,
    level: level || undefined,
  }), [questions, chapter, level]);

  /*
    一轮 = 打乱后的完整题目队列，发完才洗下一轮。这样「下一题」在一轮之内
    不会重复，也能显示「第 3 / 47 题」这样的真实进度。

    round 里连同「掌握快照」一起递增：只看未掌握时，题目集合按开轮那一刻的
    掌握状态确定。否则标记掌握会立刻改变集合，把正在作答的题从队列里抽走。
  */
  const [round, setRound] = useState({ index: 0, mastered: [] as readonly string[] });
  const [cursor, setCursor] = useState(0);

  const deck = useMemo(() => {
    const pool = unmasteredOnly
      ? scoped.filter(question => !round.mastered.includes(question.id))
      : scoped;

    /*
      第一轮保持目录顺序。这一页是预渲染的，Math.random 在构建期和浏览器里
      不可能给出同一个排列，首轮就洗牌会让 hydrate 文本对不上（React #418）。
      之后每一轮——换筛选、一轮发完、点「换一批」——都在客户端洗牌。
    */
    return round.index === 0 ? pool : shuffleQuestions(pool, random);
  }, [scoped, unmasteredOnly, round, random]);

  // 换一轮：重新洗牌、回到第一题、重置计时。由事件处理器调用，不放进 effect。
  const startRound = useCallback(() => {
    setRound(previous => ({ index: previous.index + 1, mastered: masteredIds }));
    setCursor(0);
    setRemaining(durationSeconds);
    setRevealed(false);
  }, [durationSeconds, masteredIds]);

  const current = deck[cursor];

  // 计时归零后停表：继续 tick 只会每秒空转一次 setState，且时间到需要给出反馈。
  const expired = remaining === 0;

  useEffect(() => {
    if (!current || revealed || expired) return;

    const timer = window.setInterval(() => {
      setRemaining(seconds => Math.max(0, seconds - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [current, revealed, expired]);

  const nextQuestion = () => {
    if (!deck.length) return;

    if (cursor + 1 >= deck.length) {
      startRound();
      return;
    }

    setCursor(cursor + 1);
    setRemaining(durationSeconds);
    setRevealed(false);
  };

  const masteredInScope = scoped.filter(question => masteredIds.includes(question.id)).length;

  return (
    <section className="interview-deck" aria-labelledby="interview-question">
      <div className="interview-filters">
        <label>
          章节筛选
          <select
            value={chapter}
            onChange={event => {
              setChapter(event.target.value);
              startRound();
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
              startRound();
            }}
          >
            <option value="">全部难度</option>
            {levels.map(item => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>

        <label className="interview-filters__toggle">
          <input
            type="checkbox"
            checked={unmasteredOnly}
            onChange={event => {
              setUnmasteredOnly(event.target.checked);
              startRound();
            }}
          />
          只看未掌握
        </label>

        <button type="button" className="interview-shuffle" onClick={startRound}>
          换一批
        </button>
      </div>

      <p className="interview-progress" role="status" aria-live="polite">
        {deck.length > 0
          ? `本轮第 ${Math.min(cursor + 1, deck.length)} / ${deck.length} 题`
          : '本轮没有题目'}
        <span aria-hidden="true"> · </span>
        已掌握 {masteredInScope} / {scoped.length}
      </p>

      {current ? (
        <article>
          <header>
            <p>
              {current.kind === 'main' ? '主问题' : '深度追问'}
              <span aria-hidden="true"> · </span>
              {current.level}
              <span aria-hidden="true"> · </span>
              {durationSeconds} SECOND ANSWER
            </p>
            <p aria-live="polite" data-expired={expired || undefined}>
              {expired ? '时间到，先说出你的结论再看参考答案' : `剩余 ${remaining} 秒`}
            </p>
            <h2 id="interview-question">{current.prompt}</h2>
            <p className="interview-source">出自「{current.title}」</p>
          </header>

          <div>
            {!revealed ? (
              <button type="button" onClick={() => setRevealed(true)}>
                显示参考答案
              </button>
            ) : (
              <section aria-labelledby="reference-answer">
                <h3 id="reference-answer">
                  {current.answered ? '参考答案' : '参考方向'}
                </h3>
                <p>{current.answer}</p>
                {!current.answered && (
                  <p className="interview-hint">
                    这道追问没有单独的书面答案，上面是本专题的结论。
                    完整推导见专题正文的「深度追问」。
                  </p>
                )}
              </section>
            )}
          </div>

          <footer>
            <Link to={topicPath(current)}>打开完整专题</Link>
            <button
              type="button"
              className="interview-master"
              aria-pressed={isMastered(current.id)}
              onClick={() => toggleMaster(current.id)}
            >
              <span aria-hidden="true">{isMastered(current.id) ? '✓' : '○'}</span>
              {isMastered(current.id) ? '已掌握' : '标记为掌握'}
            </button>
            <button type="button" onClick={nextQuestion}>下一题</button>
          </footer>
        </article>
      ) : (
        <p>
          {unmasteredOnly && deck.length === 0 && masteredIds.length > 0
            ? '这个范围内的题目都标记为掌握了，取消勾选可以再过一遍。'
            : '当前筛选条件下没有题目。'}
        </p>
      )}
    </section>
  );
}
