import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { chapters } from '../content/chapters';
import { chapterPath } from './paths';
import RouteFocus from './RouteFocus';

const SearchDialog = lazy(() => import('../features/search/SearchDialog'));

const primaryLinks = [
  { to: '/handbook', label: '复习手册' },
  { to: '/knowledge-map', label: '知识地图' },
  { to: '/interview', label: '面试题库' },
  { to: '/code', label: '代码手册' },
  { to: '/reference', label: '资料索引' },
];

function ChapterLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <ol>
      {chapters.map(chapter => (
        <li key={chapter.id}>
          <NavLink to={chapterPath(chapter.id)} onClick={onNavigate}>
            <span>{String(chapter.index).padStart(2, '0')}</span>
            <span>{chapter.title}</span>
          </NavLink>
        </li>
      ))}
    </ol>
  );
}

export default function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const searchTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setMenuOpen(false);
      menuTriggerRef.current?.focus();
    };

    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  useEffect(() => {
    const openSearch = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isEditing = target?.matches('input, textarea') || target?.isContentEditable;

      if (
        event.key !== '/' ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        isEditing
      ) {
        return;
      }

      event.preventDefault();
      setSearchOpen(true);
    };

    document.addEventListener('keydown', openSearch);
    return () => document.removeEventListener('keydown', openSearch);
  }, []);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">跳到正文</a>

      <header className="site-header">
        <Link className="site-brand" to="/" aria-label="前端复习手册首页">
          <span aria-hidden="true">F/</span>
          <span>前端复习手册</span>
        </Link>

        <nav aria-label="主导航">
          {primaryLinks.map(link => (
            <NavLink key={link.to} to={link.to}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <button
          ref={searchTriggerRef}
          type="button"
          aria-label="搜索手册"
          aria-haspopup="dialog"
          aria-expanded={searchOpen}
          onClick={() => setSearchOpen(true)}
        >
          搜索
          <span aria-hidden="true"> /</span>
        </button>

        <button
          ref={menuTriggerRef}
          type="button"
          aria-label="打开章节菜单"
          aria-expanded={menuOpen}
          aria-controls="mobile-chapter-menu"
          onClick={() => setMenuOpen(open => !open)}
        >
          章节
        </button>
      </header>

      <aside className="chapter-sidebar">
        <p>CHAPTER LEDGER / 01—10</p>
        <nav aria-label="章节导航">
          <ChapterLinks />
        </nav>
      </aside>

      {menuOpen && (
        <nav id="mobile-chapter-menu" aria-label="移动章节导航">
          <p>CHAPTER LEDGER / 01—10</p>
          <ChapterLinks onNavigate={() => setMenuOpen(false)} />
        </nav>
      )}

      <RouteFocus />
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>

      <footer className="site-footer">
        <p>建立知识体系，也练习如何把它讲清楚。</p>
      </footer>

      {searchOpen && (
        <Suspense
          fallback={<p className="search-loading" role="status">正在打开搜索…</p>}
        >
          <SearchDialog
            open
            onClose={() => setSearchOpen(false)}
            triggerRef={searchTriggerRef}
          />
        </Suspense>
      )}
    </div>
  );
}
