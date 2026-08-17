import { useEffect } from 'react';
import { useLocation, useMatches } from 'react-router-dom';

type TitleHandle = {
  title?: string;
};

export default function RouteFocus() {
  const { pathname } = useLocation();
  const matches = useMatches();

  useEffect(() => {
    const title = [...matches]
      .reverse()
      .map(match => (match.handle as TitleHandle | undefined)?.title)
      .find(Boolean);

    document.title = title ? `${title} · 前端复习手册` : '前端复习手册';

    const main = document.getElementById('main-content');
    const target = main?.querySelector<HTMLElement>('h1') ?? main;
    target?.focus({ preventScroll: true });
  }, [matches, pathname]);

  return null;
}
