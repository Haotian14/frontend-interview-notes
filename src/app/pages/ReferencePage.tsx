import { Link } from 'react-router-dom';
import { topics } from '../../content/registry';
import { topicPath } from '../paths';

const referenceTopics = topics.filter(topic => topic.reference);

export default function ReferencePage() {
  return (
    <div className="reference-page">
      <header>
        <p>QUICK / REFERENCE</p>
        <h1 tabIndex={-1}>前端速查表</h1>
        <p>用于面试前快速唤醒概念；每一张表都来自包含机制、边界和证据的完整专题。</p>
      </header>

      <div className="reference-tables">
        {referenceTopics.map(topic => (
          <div className="table-scroll" key={topic.slug}>
            <table>
              <caption>{topic.reference!.caption}</caption>
              <thead>
                <tr>
                  <th scope="col">概念</th>
                  <th scope="col">判断</th>
                </tr>
              </thead>
              <tbody>
                {topic.reference!.rows.map(row => (
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
    </div>
  );
}
