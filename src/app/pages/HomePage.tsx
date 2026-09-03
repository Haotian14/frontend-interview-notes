import { Link } from 'react-router-dom';
import { chapters } from '../../content/chapters';
import { topicCatalog } from '../../content/catalog';
import { chapterPath, topicPath } from '../paths';

const readingPaths = [
  {
    title: '从基础建立主干',
    description: '按章节顺序理解语言、框架、浏览器与工程体系。',
  },
  {
    title: '从高频题查缺补漏',
    description: '先回答，再进入专题核对机制、证据与边界。',
  },
  {
    title: '从项目问题反推知识',
    description: '围绕性能、稳定性和架构决策连接相关专题。',
  },
];

export default function HomePage() {
  return (
    <div className="home-page">
      <section className="home-hero" aria-labelledby="home-title">
        <p className="page-eyebrow">THE FRONTEND REVIEW / 2026</p>
        <h1 id="home-title" tabIndex={-1}>前端工程师系统复习手册</h1>
        <p className="page-lead">
          从结论出发，穿过机制、验证与边界，最后落到项目判断和面试表达。
        </p>
        <div className="button-row">
          <Link className="button button--primary" to="/handbook">开始复习</Link>
          <Link className="button" to="/knowledge-map">查看知识地图</Link>
        </div>
      </section>

      <section className="home-section" aria-labelledby="chapter-heading">
        <p className="page-eyebrow">01 / KNOWLEDGE SYSTEM</p>
        <h2 id="chapter-heading">十一个知识章节</h2>
        <ol className="home-chapters">
          {chapters.map(chapter => (
            <li key={chapter.id}>
              <Link to={chapterPath(chapter.id)}>
                <span className="home-chapters__index">
                  {String(chapter.index).padStart(2, '0')}
                </span>
                <strong>{chapter.title}</strong>
                <span>{chapter.summary}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="home-section" aria-labelledby="path-heading">
        <p className="page-eyebrow">02 / HOW TO READ</p>
        <h2 id="path-heading">三条复习路径</h2>
        <ol className="home-paths">
          {readingPaths.map((path, index) => (
            <li key={path.title}>
              <span className="home-paths__index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3>{path.title}</h3>
              <p>{path.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="home-section" aria-labelledby="sample-heading">
        <p className="page-eyebrow">03 / SAMPLE TOPICS</p>
        <h2 id="sample-heading">{topicCatalog.length} 篇专题</h2>
        <ul className="home-topics">
          {topicCatalog.map(topic => (
            <li key={topic.slug}>
              <Link to={topicPath(topic)}>{topic.title}</Link>
              <span>{topic.level} · {topic.minutes} 分钟</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
