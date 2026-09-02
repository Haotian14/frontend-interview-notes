import type { TopicMeta } from './types';

/**
 * 专题关系图。
 *
 * meta.ts 里的 `prerequisites` 和 `related` 一直被内容合同校验，却从来没有
 * 渲染到界面上。这个模块把它们变成两种可用的结构：一条按前置关系排出的
 * 学习顺序，以及每篇专题的「前置 / 支撑 / 关联」邻接表。
 *
 * prerequisites 是有向的（读 A 之前应该先读 B），related 视为无向：
 * A 声明关联 B 时，B 的页面上也应该看得到 A。
 */

export type TopicNode = {
  topic: TopicMeta;
  /** 读这篇之前应该先读的专题。 */
  prerequisites: TopicMeta[];
  /** 把这篇列为前置的专题——读完它就解锁了这些。 */
  dependents: TopicMeta[];
  /** 双向合并后的关联专题。 */
  related: TopicMeta[];
  /** 学习顺序里的层号，0 表示没有未满足的前置。 */
  stage: number;
};

export type TopicGraph = {
  nodes: TopicNode[];
  byslug: Map<string, TopicNode>;
  /** 按 stage 分组，stages[0] 是可以直接开始的专题。 */
  stages: TopicMeta[][];
};

/**
 * 逐层剥离：把前置全部已排入的专题放进当前层，直到没有专题可排。
 * 若剩下的专题互相成环（内容合同会拦截，这里只做兜底），
 * 统一并入最后一层，保证每篇专题都出现在图上而不是被静默吞掉。
 */
function assignStages(topics: TopicMeta[], known: Set<string>): Map<string, number> {
  const stageBySlug = new Map<string, number>();
  const remaining = new Map(topics.map(topic => [topic.slug, topic]));
  let stage = 0;

  while (remaining.size) {
    const ready = [...remaining.values()].filter(topic =>
      topic.prerequisites
        // 指向不存在的 slug 不该把整篇专题卡在图外。
        .filter(slug => known.has(slug))
        .every(slug => stageBySlug.has(slug)),
    );

    if (!ready.length) {
      for (const topic of remaining.values()) stageBySlug.set(topic.slug, stage);
      break;
    }

    for (const topic of ready) {
      stageBySlug.set(topic.slug, stage);
      remaining.delete(topic.slug);
    }

    stage += 1;
  }

  return stageBySlug;
}

export function buildTopicGraph(topics: TopicMeta[]): TopicGraph {
  const bySlug = new Map(topics.map(topic => [topic.slug, topic]));
  const known = new Set(bySlug.keys());
  const resolve = (slugs: string[]) =>
    slugs.flatMap(slug => {
      const topic = bySlug.get(slug);
      return topic ? [topic] : [];
    });

  const dependentSlugs = new Map<string, string[]>();
  const relatedSlugs = new Map<string, Set<string>>();

  for (const topic of topics) {
    for (const slug of topic.prerequisites) {
      if (!known.has(slug)) continue;
      dependentSlugs.set(slug, [...(dependentSlugs.get(slug) ?? []), topic.slug]);
    }

    // related 双向补齐：只有一边声明时，两边都应该看到对方。
    for (const slug of topic.related) {
      if (!known.has(slug) || slug === topic.slug) continue;
      relatedSlugs.set(topic.slug, (relatedSlugs.get(topic.slug) ?? new Set()).add(slug));
      relatedSlugs.set(slug, (relatedSlugs.get(slug) ?? new Set()).add(topic.slug));
    }
  }

  const stageBySlug = assignStages(topics, known);

  const nodes: TopicNode[] = topics.map(topic => ({
    topic,
    prerequisites: resolve(topic.prerequisites),
    dependents: resolve(dependentSlugs.get(topic.slug) ?? []),
    related: resolve([...(relatedSlugs.get(topic.slug) ?? [])]),
    stage: stageBySlug.get(topic.slug) ?? 0,
  }));

  const stageCount = nodes.reduce((max, node) => Math.max(max, node.stage), 0) + 1;
  const stages: TopicMeta[][] = Array.from({ length: stageCount }, () => []);
  for (const node of nodes) stages[node.stage].push(node.topic);

  return {
    nodes,
    byslug: new Map(nodes.map(node => [node.topic.slug, node])),
    stages,
  };
}

/** 被最多专题列为前置的知识点——先补这些，后面的路会顺很多。 */
export function findHubs(graph: TopicGraph, limit = 6): TopicNode[] {
  return [...graph.nodes]
    .filter(node => node.dependents.length > 0)
    .sort((a, b) =>
      b.dependents.length - a.dependents.length ||
      a.topic.title.localeCompare(b.topic.title, 'zh-Hans'))
    .slice(0, limit);
}

/** 前置关系成环时返回参与的 slug；内容合同用它来拦住无法排序的目录。 */
export function findPrerequisiteCycles(topics: TopicMeta[]): string[] {
  const bySlug = new Map(topics.map(topic => [topic.slug, topic]));
  const state = new Map<string, 'visiting' | 'done'>();
  const cyclic = new Set<string>();

  const visit = (slug: string, trail: string[]) => {
    if (state.get(slug) === 'done') return;

    if (state.get(slug) === 'visiting') {
      // 从 trail 里截出真正成环的那一段。
      for (const entry of trail.slice(trail.indexOf(slug))) cyclic.add(entry);
      return;
    }

    state.set(slug, 'visiting');
    for (const next of bySlug.get(slug)?.prerequisites ?? []) {
      if (bySlug.has(next)) visit(next, [...trail, slug]);
    }
    state.set(slug, 'done');
  };

  for (const topic of topics) visit(topic.slug, []);

  return [...cyclic].sort();
}
