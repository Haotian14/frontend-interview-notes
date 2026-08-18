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
      <section aria-labelledby="home-title">
        <p>THE FRONTEND REVIEW / 2026</p>
        <h1 id="home-title" tabIndex={-1}>前端工程师系统复习手册</h1>
        <p>
          从结论出发，穿过机制、验证与边界，最后落到项目判断和面试表达。
        </p>
        <Link to="/handbook">开始复习</Link>
        <Link to="/knowledge-map">查看知识地图</Link>
      </section>

      <section aria-labelledby="chapter-heading">
        <p>01 / KNOWLEDGE SYSTEM</p>
        <h2 id="chapter-heading">十个知识章节</h2>
        <ol>
          {chapters.map(chapter => (
            <li key={chapter.id}>
              <Link to={chapterPath(chapter.id)}>
                <span>{String(chapter.index).padStart(2, '0')}</span>
                <strong>{chapter.title}</strong>
                <span>{chapter.summary}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="path-heading">
        <p>02 / HOW TO READ</p>
        <h2 id="path-heading">三条复习路径</h2>
        <ol>
          {readingPaths.map(path => (
            <li key={path.title}>
              <h3>{path.title}</h3>
              <p>{path.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="sample-heading">
        <p>03 / SAMPLE TOPICS</p>
        <h2 id="sample-heading">{topicCatalog.length} 篇专题</h2>
        <ul>
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
