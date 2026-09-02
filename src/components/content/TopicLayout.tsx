import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { chapters } from '../../content/chapters';
import type { TopicMeta } from '../../content/types';
import { chapterPath } from '../../app/paths';
import ReadToggle from '../../features/progress/ReadToggle';
import ContentCallout from './ContentCallout';
import RelatedTopics from './RelatedTopics';
import TopicToc from './TopicToc';

export default function TopicLayout({
  topic,
  conclusion,
  children,
}: {
  topic: TopicMeta;
  /** 一句话结论来自按需加载的 practice.ts，由 TopicPage 取好后传入。 */
  conclusion: string;
  children: ReactNode;
}) {
  const articleRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const chapter = chapters.find(item => item.id === topic.chapter);

  // 标题由 RouteFocus 依据路由参数统一设置，这里只负责把焦点移到正文标题。
  useEffect(() => {
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
            <ReadToggle slug={topic.slug} />
          </header>

          {/*
            这句来自 practice.ts 的 interview.answer，是面试时可以直接说出口的
            版本；正文的「一句话结论」小节是同一结论的展开。两者并排时用不同
            标题区分，否则读者会以为同一段话被重复了两遍。
          */}
          <ContentCallout title="面试可用结论" variant="conclusion">
            <p>{conclusion}</p>
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
