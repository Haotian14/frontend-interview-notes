import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { chapters } from '../../content/chapters';
import type { TopicMeta } from '../../content/types';
import { chapterPath } from '../../app/paths';
import ContentCallout from './ContentCallout';
import RelatedTopics from './RelatedTopics';
import TopicToc from './TopicToc';

export default function TopicLayout({
  topic,
  children,
}: {
  topic: TopicMeta;
  children: ReactNode;
}) {
  const articleRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const chapter = chapters.find(item => item.id === topic.chapter);

  useEffect(() => {
    document.title = `${topic.title} · 前端复习手册`;
    headingRef.current?.focus({ preventScroll: true });
  }, [topic.title]);

  return (
    <div className="topic-page">
      <nav aria-label="面包屑">
        <ol>
          <li><Link to="/">首页</Link></li>
          <li><Link to="/handbook">复习手册</Link></li>
          {chapter && (
            <li><Link to={chapterPath(chapter.id)}>{chapter.title}</Link></li>
          )}
          <li aria-current="page">{topic.title}</li>
        </ol>
      </nav>

      <div className="topic-reader">
        <div className="topic-reader__main">
          <header className="topic-header">
            <p>{chapter?.title ?? topic.chapter}</p>
            <h1 ref={headingRef} tabIndex={-1}>{topic.title}</h1>
            <p>{topic.summary}</p>
            <p>{topic.level} · {topic.minutes} 分钟</p>
            <ul aria-label="关键词">
              {topic.keywords.map(keyword => <li key={keyword}>{keyword}</li>)}
            </ul>
          </header>

          <ContentCallout title="一句话结论" variant="conclusion">
            <p>{topic.interview.answer}</p>
          </ContentCallout>

          <article ref={articleRef} className="topic-content">
            {children}
          </article>

          <section aria-labelledby="topic-sources">
            <h2 id="topic-sources">官方资料</h2>
            <ul>
              {topic.sources.map(source => (
                <li key={source.href}>
                  <a href={source.href} rel="noreferrer">
                    {source.label}
                    <span className="external-link-suffix">
                      <span aria-hidden="true"> ↗</span>
                      <span className="visually-hidden">（外部链接）</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <RelatedTopics topic={topic} />
        </div>

        <aside className="topic-reader__aside">
          <TopicToc articleRef={articleRef} />
        </aside>
      </div>
    </div>
  );
}
