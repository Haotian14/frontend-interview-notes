import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { chapters } from '../../content/chapters';
import { getTopic, loadAllPractices } from '../../content/registry';
import { topicPath } from '../paths';

const chapterTitles = new Map(chapters.map(chapter => [chapter.id, chapter.title]));

// 代码条目和面试答案一样只服务这一个页面，按需加载。
const CodeList = lazy(async () => {
  const entries = (await loadAllPractices())
    .filter(practice => practice.code)
    .map(practice => ({ practice, topic: getTopic(practice.slug)! }));

  return {
    default: () => (
      <ul>
        {entries.map(({ practice, topic }) => (
          <li key={topic.slug}>
            <article>
              <p>{chapterTitles.get(topic.chapter) ?? topic.chapter} · {topic.level}</p>
              <h2>{topic.title}</h2>
              <p>{topic.summary}</p>
              <dl>
                <div>
                  <dt>预期输入</dt>
                  <dd>{practice.code!.input}</dd>
                </div>
                <div>
                  <dt>预期输出</dt>
                  <dd>{practice.code!.output}</dd>
                </div>
              </dl>
              <Link to={topicPath(topic)}>打开「{topic.title}」完整专题</Link>
            </article>
          </li>
        ))}
      </ul>
    ),
  };
});

export default function CodePage() {
  return (
    <div className="code-page">
      <header>
        <p>CODE / MINIMAL VERIFICATION</p>
        <h1 tabIndex={-1}>代码手册</h1>
        <p>这里索引能验证核心机制的最小示例，不在浏览器中执行任意代码。</p>
      </header>

      <Suspense fallback={<p role="status">正在加载代码条目…</p>}>
        <CodeList />
      </Suspense>
    </div>
  );
}
