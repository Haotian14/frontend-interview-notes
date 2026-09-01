import { Link } from 'react-router-dom';
import { chapters } from '../../content/chapters';
import { getChapterTopics, topics } from '../../content/registry';
import { useProgress } from '../../features/progress/useProgress';
import { chapterPath, topicPath } from '../paths';

export default function HandbookPage() {
  const { isRead, readSlugs, reset } = useProgress();
  const done = readSlugs.length;

  return (
    <div className="handbook-page">
      <header>
        <p>HANDBOOK / INDEX</p>
        <h1 tabIndex={-1}>完整手册目录</h1>
        <p>十一个章节构成从基础机制到工程决策的复习主干。</p>
        <p className="handbook-progress" aria-live="polite">
          已读完 {done} / {topics.length} 篇
          {done > 0 && (
            <button type="button" className="progress-reset" onClick={reset}>
              清除进度
            </button>
          )}
        </p>
      </header>

      <ol>
        {chapters.map(chapter => {
          const chapterTopics = getChapterTopics(chapter.id);
          const chapterDone = chapterTopics.filter(topic => isRead(topic.slug)).length;

          return (
            <li key={chapter.id}>
              <article>
                <span>{String(chapter.index).padStart(2, '0')}</span>
                <h2>
                  <Link to={chapterPath(chapter.id)}>{chapter.title}</Link>
                </h2>
                <p>{chapter.summary}</p>
                <p>
                  {chapterTopics.length} 篇专题
                  {chapterDone > 0 && ` · 已读 ${chapterDone}`}
                </p>
                {chapterTopics.length > 0 && (
                  <ul>
                    {chapterTopics.map(topic => (
                      <li key={topic.slug} data-read={isRead(topic.slug) || undefined}>
                        <Link to={topicPath(topic)}>{topic.title}</Link>
                        {isRead(topic.slug) && (
                          <span className="visually-hidden">（已读完）</span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
