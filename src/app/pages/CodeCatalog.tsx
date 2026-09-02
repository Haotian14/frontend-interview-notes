import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { chapters } from '../../content/chapters';
import type { CodeSpec, TopicMeta } from '../../content/types';
import FilterBar, { emptyFilters, matchesFilters } from '../../components/content/FilterBar';
import type { FilterState } from '../../components/content/FilterBar';
import { topicPath } from '../paths';

export type CodeEntry = { topic: TopicMeta; code: CodeSpec };

const chapterTitles = new Map(chapters.map(chapter => [chapter.id, chapter.title]));

export default function CodeCatalog({ entries }: { entries: CodeEntry[] }) {
  const [filters, setFilters] = useState<FilterState>(emptyFilters);

  const visible = useMemo(
    () => entries.filter(entry => matchesFilters(entry.topic, filters)),
    [entries, filters],
  );

  // 按章节分组，让 48 条样例有稳定的结构，而不是一条长列表。
  const grouped = useMemo(() => {
    const byChapter = new Map<string, CodeEntry[]>();
    for (const entry of visible) {
      byChapter.set(entry.topic.chapter, [...(byChapter.get(entry.topic.chapter) ?? []), entry]);
    }
    return chapters
      .filter(chapter => byChapter.has(chapter.id))
      .map(chapter => ({ chapter, items: byChapter.get(chapter.id)! }));
  }, [visible]);

  const availableChapters = useMemo(
    () => [...new Set(entries.map(entry => entry.topic.chapter))],
    [entries],
  );

  return (
    <>
      <FilterBar
        filters={filters}
        onChange={setFilters}
        availableChapters={availableChapters}
        resultCount={visible.length}
        totalCount={entries.length}
        unit="条样例"
        searchPlaceholder="搜索标题、摘要或关键词…"
      />

      {grouped.length === 0 && (
        <p className="empty-state">没有符合条件的样例，换个章节或关键词试试。</p>
      )}

      {grouped.map(({ chapter, items }) => (
        <section className="catalog-group" key={chapter.id} aria-labelledby={`code-${chapter.id}`}>
          <h2 id={`code-${chapter.id}`}>
            <span aria-hidden="true">{String(chapter.index).padStart(2, '0')}</span>
            {chapter.title}
            <small>{items.length} 条</small>
          </h2>

          <ul className="code-entries">
            {items.map(({ topic, code }) => (
              <li key={topic.slug}>
                <article>
                  <p className="code-entry__meta">
                    {chapterTitles.get(topic.chapter)} · {topic.level}
                  </p>
                  <h3>{topic.title}</h3>
                  <p>{topic.summary}</p>
                  <dl>
                    <div>
                      <dt>预期输入</dt>
                      <dd>{code.input}</dd>
                    </div>
                    <div>
                      <dt>预期输出</dt>
                      <dd>{code.output}</dd>
                    </div>
                  </dl>
                  <Link to={topicPath(topic)}>打开「{topic.title}」完整专题</Link>
                </article>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
