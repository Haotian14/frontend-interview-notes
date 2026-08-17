import { Link } from 'react-router-dom';
import { chapters } from '../../content/chapters';
import { getChapterTopics, getTopic, topics } from '../../content/registry';
import { chapterPath, topicPath } from '../paths';

const relatedEdges = topics.flatMap(topic =>
  topic.related.flatMap(relatedSlug => {
    const related = getTopic(relatedSlug);
    return related ? [{ from: topic, to: related }] : [];
  }),
);

export default function KnowledgeMapPage() {
  return (
    <div className="knowledge-map-page">
      <header>
        <p>KNOWLEDGE / MAP</p>
        <h1 tabIndex={-1}>知识地图</h1>
        <p>用可浏览的章节节点和专题关系，定位知识在整体体系中的位置。</p>
      </header>

      <section aria-labelledby="map-chapters">
        <h2 id="map-chapters">章节节点</h2>
        <ol>
          {chapters.map(chapter => (
            <li key={chapter.id}>
              <h3>
                <Link to={chapterPath(chapter.id)}>
                  {String(chapter.index).padStart(2, '0')} · {chapter.title}
                </Link>
              </h3>
              <p>{chapter.summary}</p>
              <ul>
                {getChapterTopics(chapter.id).map(topic => (
                  <li key={topic.slug}>
                    <Link to={topicPath(topic)}>{topic.title}</Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="map-relations">
        <h2 id="map-relations">关联专题</h2>
        {relatedEdges.length > 0 ? (
          <ul>
            {relatedEdges.map(edge => (
              <li key={`${edge.from.slug}-${edge.to.slug}`}>
                <Link to={topicPath(edge.from)}>{edge.from.title}</Link>
                <span aria-hidden="true"> → </span>
                <Link to={topicPath(edge.to)}>{edge.to.title}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>当前样板专题之间暂无关联边。</p>
        )}
      </section>
    </div>
  );
}
