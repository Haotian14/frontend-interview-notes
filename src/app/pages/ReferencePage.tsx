import { Link } from 'react-router-dom';
import { getTopic } from '../../content/registry';
import { topicPath } from '../paths';

type ReferenceRow = {
  term: string;
  meaning: string;
  topic: string;
};

const referenceTables: Array<{
  caption: string;
  rows: ReferenceRow[];
}> = [
  {
    caption: 'HTTP 缓存指令速查',
    rows: [
      { term: 'max-age', meaning: '定义响应的新鲜时间。', topic: 'http-cache' },
      { term: 'no-cache', meaning: '允许存储，但复用前必须验证。', topic: 'http-cache' },
      { term: 'no-store', meaning: '禁止存储响应。', topic: 'http-cache' },
    ],
  },
  {
    caption: '浏览器渲染阶段速查',
    rows: [
      { term: 'Style', meaning: '为节点计算最终样式。', topic: 'rendering-pipeline' },
      { term: 'Layout', meaning: '计算几何尺寸与位置。', topic: 'rendering-pipeline' },
      { term: 'Paint / Composite', meaning: '生成绘制指令并组合图层。', topic: 'rendering-pipeline' },
    ],
  },
  {
    caption: 'TypeScript 收窄工具速查',
    rows: [
      { term: 'typeof / instanceof', meaning: '依据运行时类型信息收窄。', topic: 'type-narrowing' },
      { term: '可辨识联合', meaning: '用共同字段表达有限状态。', topic: 'type-narrowing' },
      { term: 'never', meaning: '在分支末尾执行穷尽检查。', topic: 'type-narrowing' },
    ],
  },
  {
    caption: 'React 状态选择',
    rows: [
      { term: '渲染期计算', meaning: '可由现有 props 与 state 推导的值。', topic: 'render-state-snapshot' },
      { term: '独立 state', meaning: '无法从现有数据纯计算的交互状态。', topic: 'render-state-snapshot' },
      { term: '函数式更新', meaning: '下一状态依赖前一状态时使用。', topic: 'render-state-snapshot' },
    ],
  },
  {
    caption: '测试层级选择',
    rows: [
      { term: '单元测试', meaning: '快速验证纯规则和边界。', topic: 'testing-strategy' },
      { term: '组件集成测试', meaning: '验证组件、路由和状态协作。', topic: 'testing-strategy' },
      { term: '端到端测试', meaning: '覆盖少量关键跨页面链路。', topic: 'testing-strategy' },
    ],
  },
];

function TopicLink({ slug }: { slug: string }) {
  const topic = getTopic(slug);
  if (!topic) return null;
  return <Link to={topicPath(topic)}>{topic.title}</Link>;
}

export default function ReferencePage() {
  return (
    <div className="reference-page">
      <header>
        <p>QUICK / REFERENCE</p>
        <h1 tabIndex={-1}>前端速查表</h1>
        <p>用于面试前快速唤醒概念；每一项都链接到包含机制、边界和证据的完整专题。</p>
      </header>

      <div className="reference-tables">
        {referenceTables.map(table => (
          <div className="table-scroll" key={table.caption}>
            <table>
              <caption>{table.caption}</caption>
              <thead>
                <tr>
                  <th scope="col">概念</th>
                  <th scope="col">判断</th>
                  <th scope="col">样板专题</th>
                </tr>
              </thead>
              <tbody>
                {table.rows.map(row => (
                  <tr key={row.term}>
                    <th scope="row">{row.term}</th>
                    <td>{row.meaning}</td>
                    <td><TopicLink slug={row.topic} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
