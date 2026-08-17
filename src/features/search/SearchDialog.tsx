import { useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent, RefObject } from 'react';
import { Link } from 'react-router-dom';
import { topicPath } from '../../app/paths';
import HighlightText from './HighlightText';
import { searchTopics } from './searchIndex';

type SearchDialogProps = {
  open: boolean;
  onClose: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
};

export default function SearchDialog({
  open,
  onClose,
  triggerRef,
}: SearchDialogProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const dialogRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const results = useMemo(() => searchTopics(query), [query]);
  const activeResult = results[activeIndex];
  const activeId = activeResult ? `search-result-${activeResult.item.slug}` : undefined;

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  if (!open) return null;

  const closeAndRestore = () => {
    onClose();
    queueMicrotask(() => triggerRef.current?.focus());
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeAndRestore();
      return;
    }

    if (event.key === 'ArrowDown' && results.length) {
      event.preventDefault();
      setActiveIndex(index => (index + 1) % results.length);
      return;
    }

    if (event.key === 'ArrowUp' && results.length) {
      event.preventDefault();
      setActiveIndex(index => (index - 1 + results.length) % results.length);
      return;
    }

    if (event.key === 'Enter' && activeResult) {
      event.preventDefault();
      resultRefs.current[activeIndex]?.click();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusable = [...(dialogRef.current?.querySelectorAll<HTMLElement>('[data-search-focus]') ?? [])];
    if (!focusable.length) return;

    const current = focusable.indexOf(document.activeElement as HTMLElement);
    const next = event.shiftKey
      ? (current <= 0 ? focusable.length - 1 : current - 1)
      : (current >= focusable.length - 1 ? 0 : current + 1);

    event.preventDefault();
    focusable[next]?.focus();
  };

  return (
    <div className="search-layer">
      <section
        ref={dialogRef}
        className="search-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="搜索手册"
        onKeyDown={handleKeyDown}
      >
        <header>
          <label htmlFor="handbook-search">搜索知识点</label>
          <input
            ref={inputRef}
            id="handbook-search"
            type="search"
            role="combobox"
            aria-label="搜索知识点"
            aria-autocomplete="list"
            aria-controls="search-results"
            aria-expanded={results.length > 0}
            aria-activedescendant={activeId}
            autoComplete="off"
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="搜索事件循环、缓存、状态快照…"
            data-search-focus
          />
          <button type="button" onClick={closeAndRestore} data-search-focus>
            关闭
          </button>
        </header>

        <p role="status" aria-live="polite">
          {query.trim() ? `找到 ${results.length} 个专题` : '输入关键词开始搜索'}
        </p>

        <ul id="search-results" role="listbox" aria-label="搜索结果">
          {results.map((result, index) => {
            const topic = result.item;
            const selected = index === activeIndex;
            return (
              <li key={topic.slug}>
                <Link
                  ref={node => {
                    resultRefs.current[index] = node;
                  }}
                  id={`search-result-${topic.slug}`}
                  role="option"
                  aria-selected={selected}
                  to={topicPath(topic)}
                  onMouseMove={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  onClick={onClose}
                  data-search-focus
                >
                  <strong><HighlightText text={topic.title} query={query} /></strong>
                  <span><HighlightText text={topic.summary} query={query} /></span>
                  <small>{topic.level} · {topic.minutes} 分钟</small>
                </Link>
              </li>
            );
          })}
        </ul>

        {query.trim() && results.length === 0 && (
          <p>没有匹配内容，试试更短的关键词。</p>
        )}
      </section>
    </div>
  );
}
