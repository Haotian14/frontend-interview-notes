import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { getTopic, loadAllPractices } from '../../content/registry';
import { topicPath } from '../paths';

// 速查表按需加载，理由同 /interview：它只服务这一个页面。
const ReferenceTables = lazy(async () => {
  const referenced = (await loadAllPractices())
    .filter(practice => practice.reference)
    .map(practice => ({ practice, topic: getTopic(practice.slug)! }));

  return {
    default: () => (
      <div className="reference-tables">
        {referenced.map(({ practice, topic }) => (
          <div className="table-scroll" key={practice.slug}>
            <table>
              <caption>{practice.reference!.caption}</caption>
              <thead>
                <tr>
                  <th scope="col">概念</th>
                  <th scope="col">判断</th>
                </tr>
              </thead>
              <tbody>
                {practice.reference!.rows.map(row => (
                  <tr key={row.term}>
                    <th scope="row">{row.term}</th>
                    <td>{row.meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="reference-source">
              来自专题 <Link to={topicPath(topic)}>{topic.title}</Link>
            </p>
          </div>
        ))}
      </div>
    ),
  };
});

export default function ReferencePage() {
  return (
    <div className="reference-page">
      <header>
        <p>QUICK / REFERENCE</p>
        <h1 tabIndex={-1}>前端速查表</h1>
        <p>用于面试前快速唤醒概念；每一张表都来自包含机制、边界和证据的完整专题。</p>
      </header>

      <Suspense fallback={<p role="status">正在加载速查表…</p>}>
        <ReferenceTables />
      </Suspense>
    </div>
  );
}
