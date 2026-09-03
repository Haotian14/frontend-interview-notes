import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { chapters } from '../../content/chapters';
import { buildTopicGraph, findHubs } from '../../content/graph';
import { topics } from '../../content/registry';
import type { TopicMeta } from '../../content/types';
import FilterBar, { emptyFilters, matchesFilters } from '../../components/content/FilterBar';
import type { FilterState } from '../../components/content/FilterBar';
import { topicPath } from '../paths';

const graph = buildTopicGraph(topics);
const hubs = findHubs(graph);
const chapterTitles = new Map(chapters.map(chapter => [chapter.id, chapter.title]));

const stageLabels = [
  '可以直接开始',
  '需要一层前置',
  '需要两层前置',
];

function stageLabel(stage: number) {
  return stageLabels[stage] ?? `需要 ${stage} 层前置`;
}

function TopicLinkList({ label, items }: { label: string; items: TopicMeta[] }) {
  if (!items.length) return null;

  return (
    <p className="map-node__edges">
      <span className="map-node__edge-label">{label}</span>
      {items.map((item, index) => (
        <span key={item.slug}>
          {index > 0 && <span aria-hidden="true">、</span>}
          <Link to={topicPath(item)}>{item.title}</Link>
        </span>
      ))}
    </p>
  );
}

export default function KnowledgeMapView() {
  const [filters, setFilters] = useState<FilterState>(emptyFilters);

  const visibleStages = useMemo(() => {
    const kept = graph.nodes.filter(node => matchesFilters(node.topic, filters));
    const byStage = new Map<number, typeof kept>();

    for (const node of kept) {
      byStage.set(node.stage, [...(byStage.get(node.stage) ?? []), node]);
    }

    return [...byStage.entries()].sort(([a], [b]) => a - b);
  }, [filters]);

  const matchCount = visibleStages.reduce((total, [, nodes]) => total + nodes.length, 0);
  const edgeCount = graph.nodes.reduce((total, node) => total + node.dependents.length, 0);

  return (
    <div className="knowledge-map-page">
      <header className="page-header">
        <p className="page-eyebrow">KNOWLEDGE / MAP</p>
        <h1 tabIndex={-1}>知识地图</h1>
        <p className="page-lead">
          按 meta 里声明的前置关系把 {topics.length} 篇专题排成学习顺序，
          并给出每篇的前置、支撑与关联邻居。
        </p>
        <ul className="map-stats">
          <li><strong>{topics.length}</strong> 篇专题</li>
          <li><strong>{graph.stages.length}</strong> 个学习阶段</li>
          <li><strong>{edgeCount}</strong> 条前置依赖</li>
        </ul>
      </header>

      <section aria-labelledby="map-hubs">
        <h2 id="map-hubs">先补这些</h2>
        <p className="section-note">
          被最多专题列为前置的知识点。它们没读透，后面的专题会反复卡住。
        </p>
        <ol className="map-hubs">
          {hubs.map((node, index) => (
            <li key={node.topic.slug}>
              <span className="map-hubs__rank" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h3>
                  <Link to={topicPath(node.topic)}>{node.topic.title}</Link>
                </h3>
                <p>
                  {chapterTitles.get(node.topic.chapter)} · 支撑 {node.dependents.length} 篇后续专题
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="map-order">
        <h2 id="map-order">学习顺序</h2>
        <p className="section-note">
          同一阶段内的专题互不依赖，可以任意顺序读；进入下一阶段前先读完上一阶段。
        </p>

        <FilterBar
          filters={filters}
          onChange={setFilters}
          availableChapters={chapters.map(chapter => chapter.id)}
          resultCount={matchCount}
          totalCount={topics.length}
          unit="篇专题"
        />

        {visibleStages.length === 0 && (
          <p className="empty-state">没有符合条件的专题，换个章节或关键词试试。</p>
        )}

        {visibleStages.map(([stage, nodes]) => (
          <section className="map-stage" key={stage} aria-labelledby={`stage-${stage}`}>
            <h3 id={`stage-${stage}`}>
              <span aria-hidden="true">阶段 {String(stage + 1).padStart(2, '0')}</span>
              <span className="visually-hidden">阶段 {stage + 1}</span>
              <em>{stageLabel(stage)}</em>
              <small>{nodes.length} 篇</small>
            </h3>

            <ul className="map-nodes">
              {nodes.map(node => (
                <li key={node.topic.slug} className="map-node">
                  <h4>
                    <Link to={topicPath(node.topic)}>{node.topic.title}</Link>
                  </h4>
                  <p className="map-node__meta">
                    {chapterTitles.get(node.topic.chapter)} · {node.topic.level} · {node.topic.minutes} 分钟
                  </p>
                  <TopicLinkList label="前置" items={node.prerequisites} />
                  <TopicLinkList label="支撑" items={node.dependents} />
                  <TopicLinkList label="关联" items={node.related} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </section>
    </div>
  );
}
