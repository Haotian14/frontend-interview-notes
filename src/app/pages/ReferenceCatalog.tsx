import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { chapters } from '../../content/chapters';
import type { ReferenceTable, TopicMeta } from '../../content/types';
import FilterBar, { emptyFilters, matchesFilters } from '../../components/content/FilterBar';
import type { FilterState } from '../../components/content/FilterBar';
import { topicPath } from '../paths';

export type ReferenceEntry = { topic: TopicMeta; table: ReferenceTable };

export default function ReferenceCatalog({ entries }: { entries: ReferenceEntry[] }) {
  const [filters, setFilters] = useState<FilterState>(emptyFilters);

  /*
    速查表的用途是面试前快速唤醒概念，所以关键词要能命中表格内容本身，
    而不只是专题标题——「强缓存」这种词往往只出现在某一行里。
  */
  const visible = useMemo(() => entries.filter(entry => {
    if (matchesFilters(entry.topic, filters)) return true;

    const query = filters.query.trim().toLowerCase();
    if (!query) return false;
    if (filters.chapter && entry.topic.chapter !== filters.chapter) return false;
    if (filters.level && entry.topic.level !== filters.level) return false;

    return [
      entry.table.caption,
      ...entry.table.rows.flatMap(row => [row.term, row.meaning]),
    ].join(' ').toLowerCase().includes(query);
  }), [entries, filters]);

  const grouped = useMemo(() => {
    const byChapter = new Map<string, ReferenceEntry[]>();
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
        unit="张速查表"
        searchPlaceholder="搜索表格里的概念，例如「强缓存」…"
      />

      {/* 章节跳转索引：50 张表铺开后，没有它就只能靠滚动找。 */}
      {grouped.length > 1 && (
        <nav className="jump-index" aria-label="章节跳转">
          <ul>
            {grouped.map(({ chapter, items }) => (
              <li key={chapter.id}>
                <a href={`#reference-${chapter.id}`}>
                  {String(chapter.index).padStart(2, '0')} {chapter.title}
                  <span aria-hidden="true"> ({items.length})</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {grouped.length === 0 && (
        <p className="empty-state">没有符合条件的速查表，换个章节或关键词试试。</p>
      )}

      {grouped.map(({ chapter, items }) => (
        <section
          className="catalog-group"
          key={chapter.id}
          id={`reference-${chapter.id}`}
          aria-labelledby={`reference-heading-${chapter.id}`}
        >
          <h2 id={`reference-heading-${chapter.id}`}>
            <span aria-hidden="true">{String(chapter.index).padStart(2, '0')}</span>
            {chapter.title}
            <small>{items.length} 张</small>
          </h2>

          <div className="reference-tables">
            {items.map(({ topic, table }) => (
              <div className="table-scroll" key={topic.slug}>
                <table>
                  <caption>{table.caption}</caption>
                  <thead>
                    <tr>
                      <th scope="col">概念</th>
                      <th scope="col">判断</th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.rows.map(row => (
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
        </section>
      ))}
    </>
  );
}
