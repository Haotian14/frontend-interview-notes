import { Link } from 'react-router-dom';
import { getAdjacentTopics, getTopic } from '../../content/registry';
import type { TopicMeta } from '../../content/types';
import { topicPath } from '../../app/paths';

export default function RelatedTopics({ topic }: { topic: TopicMeta }) {
  const related = topic.related.flatMap(slug => {
    const item = getTopic(slug);
    return item ? [item] : [];
  });
  const adjacent = getAdjacentTopics(topic.slug);

  return (
    <div className="topic-connections">
      <nav aria-label="关联专题">
        <h2>关联专题</h2>
        {related.length > 0 ? (
          <ul>
            {related.map(item => (
              <li key={item.slug}>
                <Link to={topicPath(item)}>{item.title}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>当前专题暂无额外关联项。</p>
        )}
      </nav>

      <nav aria-label="相邻专题">
        {adjacent.previous && (
          <Link
            to={topicPath(adjacent.previous)}
            aria-label={`上一篇：${adjacent.previous.title}`}
          >
            <span>上一篇</span>
            <strong>{adjacent.previous.title}</strong>
          </Link>
        )}
        {adjacent.next && (
          <Link
            to={topicPath(adjacent.next)}
            aria-label={`下一篇：${adjacent.next.title}`}
          >
            <span>下一篇</span>
            <strong>{adjacent.next.title}</strong>
          </Link>
        )}
      </nav>
    </div>
  );
}
