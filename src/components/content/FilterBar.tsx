import { useId } from 'react';
import { chapters } from '../../content/chapters';
import type { TopicLevel } from '../../content/types';

const levels: TopicLevel[] = ['基础', '高频', '进阶'];

export type FilterState = {
  chapter: string;
  level: TopicLevel | '';
  query: string;
};

export const emptyFilters: FilterState = { chapter: '', level: '', query: '' };

/** 只保留目录里真有内容的章节，避免筛出空结果。 */
export function matchesFilters(
  topic: { chapter: string; level: TopicLevel; title: string; summary: string; keywords: string[] },
  filters: FilterState,
) {
  if (filters.chapter && topic.chapter !== filters.chapter) return false;
  if (filters.level && topic.level !== filters.level) return false;

  const query = filters.query.trim().toLowerCase();
  if (!query) return true;

  return [topic.title, topic.summary, ...topic.keywords]
    .join(' ')
    .toLowerCase()
    .includes(query);
}

type FilterBarProps = {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  /** 出现在章节下拉里的章节 id，通常是当前页面真正有条目的那些。 */
  availableChapters: string[];
  resultCount: number;
  totalCount: number;
  /** 结果计数的量词，例如「篇专题」「张速查表」。 */
  unit: string;
  searchPlaceholder?: string;
  showLevel?: boolean;
};

/**
 * /knowledge-map、/code 和 /reference 都是一次性铺开几十条内容的汇总页。
 * 没有筛选时它们只能靠 Ctrl+F 使用，所以三个页面共用同一组控件。
 */
export default function FilterBar({
  filters,
  onChange,
  availableChapters,
  resultCount,
  totalCount,
  unit,
  searchPlaceholder = '搜索标题、摘要或关键词…',
  showLevel = true,
}: FilterBarProps) {
  const id = useId();
  const active = Boolean(filters.chapter || filters.level || filters.query.trim());
  const visible = chapters.filter(chapter => availableChapters.includes(chapter.id));

  return (
    <div className="filter-bar">
      <div className="filter-bar__controls">
        <label htmlFor={`${id}-chapter`}>
          章节
          <select
            id={`${id}-chapter`}
            value={filters.chapter}
            onChange={event => onChange({ ...filters, chapter: event.target.value })}
          >
            <option value="">全部章节</option>
            {visible.map(chapter => (
              <option key={chapter.id} value={chapter.id}>
                {String(chapter.index).padStart(2, '0')} · {chapter.title}
              </option>
            ))}
          </select>
        </label>

        {showLevel && (
          <label htmlFor={`${id}-level`}>
            难度
            <select
              id={`${id}-level`}
              value={filters.level}
              onChange={event =>
                onChange({ ...filters, level: event.target.value as TopicLevel | '' })}
            >
              <option value="">全部难度</option>
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </label>
        )}

        <label className="filter-bar__search" htmlFor={`${id}-query`}>
          关键词
          <input
            id={`${id}-query`}
            type="search"
            autoComplete="off"
            value={filters.query}
            placeholder={searchPlaceholder}
            onChange={event => onChange({ ...filters, query: event.target.value })}
          />
        </label>

        <button
          type="button"
          className="filter-bar__reset"
          onClick={() => onChange(emptyFilters)}
          disabled={!active}
        >
          清除筛选
        </button>
      </div>

      <p className="filter-bar__count" role="status" aria-live="polite">
        {active
          ? `筛选出 ${resultCount} / ${totalCount} ${unit}`
          : `共 ${totalCount} ${unit}`}
      </p>
    </div>
  );
}
