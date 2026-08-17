import { Link } from 'react-router-dom';
import { topics } from '../../content/registry';
import { topicPath } from '../paths';

const codeTopics = topics.filter(topic => topic.hasCode);

export default function CodePage() {
  return (
    <div className="code-page">
      <header>
        <p>CODE / MINIMAL VERIFICATION</p>
        <h1 tabIndex={-1}>代码手册</h1>
        <p>这里索引能验证核心机制的最小示例，不在浏览器中执行任意代码。</p>
      </header>

      <ul>
        {codeTopics.map(topic => (
          <li key={topic.slug}>
            <article>
              <p>{topic.chapter} · {topic.level}</p>
              <h2>{topic.title}</h2>
              <p>{topic.summary}</p>
              <dl>
                <div>
                  <dt>预期输入</dt>
                  <dd>专题给出的最小场景、数据或用户操作。</dd>
                </div>
                <div>
                  <dt>预期输出</dt>
                  <dd>可观察的日志、类型结果、界面状态或浏览器行为。</dd>
                </div>
              </dl>
              <Link to={topicPath(topic)}>打开「{topic.title}」完整专题</Link>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
