import { Link, useParams } from 'react-router-dom';
import { chapters } from '../../content/chapters';
import { getChapterTopics } from '../../content/registry';
import { topicPath } from '../paths';

export default function ChapterPage() {
  const { chapter: chapterId } = useParams();
  const chapter = chapters.find(item => item.id === chapterId);

  if (!chapter) {
    throw new Response('Unknown handbook chapter', {
      status: 404,
      statusText: 'Not Found',
    });
  }

  const chapterTopics = getChapterTopics(chapter.id);

  return (
    <div className="chapter-page">
      <header className="page-header">
        <p className="page-eyebrow">CHAPTER / {String(chapter.index).padStart(2, '0')}</p>
        <h1 tabIndex={-1}>{chapter.title}</h1>
        <p className="page-lead">{chapter.summary}</p>
      </header>

      <section aria-labelledby="chapter-goals">
        <h2 id="chapter-goals">本章目标</h2>
        <ul>
          <li>能够用一句话给出准确结论。</li>
          <li>能够解释关键机制并用最小材料验证。</li>
          <li>能够说明项目应用、限制条件和替代方案。</li>
        </ul>
      </section>

      <section aria-labelledby="chapter-topics">
        <h2 id="chapter-topics">样板专题</h2>
        {chapterTopics.length > 0 ? (
          <ol>
            {chapterTopics.map(topic => (
              <li key={topic.slug}>
                <Link to={topicPath(topic)}>{topic.title}</Link>
                <p>{topic.summary}</p>
                <span>{topic.level} · {topic.minutes} 分钟</span>
              </li>
            ))}
          </ol>
        ) : (
          <p>本章专题将在后续批次补充。</p>
        )}
      </section>

      <Link className="button" to="/handbook">返回完整目录</Link>
    </div>
  );
}
