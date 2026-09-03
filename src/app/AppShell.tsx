import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { chapters } from '../content/chapters';
import { chapterPath } from './paths';
import ThemeToggle from '../features/theme/ThemeToggle';
import RouteFocus from './RouteFocus';

const SearchDialog = lazy(() => import('../features/search/SearchDialog'));

const primaryLinks = [
  { to: '/handbook', label: '复习手册' },
  { to: '/knowledge-map', label: '知识地图' },
  { to: '/interview', label: '面试题库' },
  { to: '/code', label: '代码手册' },
  { to: '/reference', label: '资料索引' },
];

// 章节数字随目录增长，写死的「01—10」会和实际章节数脱节。
const chapterLedgerLabel = `CHAPTER LEDGER / 01—${String(chapters.length).padStart(2, '0')}`;

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
  const menuRef = useRef<HTMLElement>(null);

  const closeMenu = () => {
    setMenuOpen(false);
    menuTriggerRef.current?.focus();
  };

  // 抽屉是移动端唯一的导航入口，打开后要像对话框一样自足：
  // Escape 关闭、Tab 循环留在抽屉内、背景不跟着滚。
  useEffect(() => {
    if (!menuOpen) return;

    const focusables = () => [
      ...(menuRef.current?.querySelectorAll<HTMLElement>('a[href], button') ?? []),
    ];

    focusables()[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== 'Tab') return;

      const items = focusables();
      if (!items.length) return;

      const current = items.indexOf(document.activeElement as HTMLElement);
      const next = event.shiftKey
        ? (current <= 0 ? items.length - 1 : current - 1)
        : (current >= items.length - 1 ? 0 : current + 1);

      event.preventDefault();
      items[next]?.focus();
    };

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', onKeyDown);
    };
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

        <ThemeToggle />

        <button
          ref={searchTriggerRef}
          type="button"
          aria-label="搜索手册"
          aria-haspopup="dialog"
          aria-expanded={searchOpen}
          onClick={() => setSearchOpen(true)}
        >
          搜索
          <kbd className="kbd-hint" aria-hidden="true">/</kbd>
        </button>

        <button
          ref={menuTriggerRef}
          type="button"
          aria-label="打开导航菜单"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen(open => !open)}
        >
          菜单
        </button>
      </header>

      <aside className="chapter-sidebar">
        <p>{chapterLedgerLabel}</p>
        <nav aria-label="章节导航">
          <ChapterLinks />
        </nav>
      </aside>

      {menuOpen && (
        <>
          <div
            className="mobile-menu-backdrop"
            onClick={closeMenu}
            aria-hidden="true"
          />
          {/*
            移动端 header 里的主导航被媒体查询隐藏，所以抽屉必须同时承载
            一级栏目和章节：少了前者，/interview、/code、/reference 在手机上
            就没有任何入口。
          */}
          <nav ref={menuRef} id="mobile-menu" aria-label="移动导航">
            <p>NAVIGATION</p>
            <ul className="mobile-menu__primary">
              {primaryLinks.map(link => (
                <li key={link.to}>
                  <NavLink to={link.to} onClick={() => setMenuOpen(false)}>
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <p>{chapterLedgerLabel}</p>
            <ChapterLinks onNavigate={() => setMenuOpen(false)} />
          </nav>
        </>
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
            onClose={() => setSearchOpen(false)}
            triggerRef={searchTriggerRef}
          />
        </Suspense>
      )}
    </div>
  );
}
