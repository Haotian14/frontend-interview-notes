import { useEffect } from 'react';
import { useLocation, useMatches } from 'react-router-dom';

/** handle.title 可以是常量，也可以按路由参数计算（专题、章节页需要）。 */
type TitleHandle = {
  title?: string | ((params: Record<string, string | undefined>) => string | undefined);
};

export default function RouteFocus() {
  const { pathname, hash } = useLocation();
  const matches = useMatches();

  useEffect(() => {
    // 标题只在这里写一次。此前 TopicLayout 也会写，导致预渲染的正确标题先被
    // 路由的通用标题覆盖、再被改回来，切换时看得到闪动。
    const title = [...matches]
      .reverse()
      .map(match => {
        const handle = (match.handle as TitleHandle | undefined)?.title;
        return typeof handle === 'function' ? handle(match.params) : handle;
      })
      .find(Boolean);

    document.title = title ? `${title} · 前端复习手册` : '前端复习手册';

    const main = document.getElementById('main-content');

    // 搜索结果会深链到具体小节（#标题），react-router 不处理 hash 目标。
    //
    // 只滚一次不够：专题正文由 React.lazy 送达，代码高亮和字体也会在之后改变
    // 布局，锚点位置会漂移，甚至整个 Suspense 边界会被替换掉，滚动被重置回顶部。
    // 因此这里持续校正，直到位置连续两次稳定，或超时为止。
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      const deadline = Date.now() + 1500;
      let timer = 0;
      let focused = false;

      // 不能一"对齐"就收手：正文还没排完时锚点恰好落在当前位置也会看起来对齐，
      // 随后内容长出来又把它推走。所以在固定窗口内持续校正，直到用户自己滚动。
      const align = () => {
        const anchor = document.getElementById(id);

        if (anchor) {
          const top = anchor.getBoundingClientRect().top + window.scrollY;

          if (!focused) {
            anchor.setAttribute('tabindex', '-1');
            anchor.focus({ preventScroll: true });
            focused = true;
          }

          if (Math.abs(top - window.scrollY) > 4) {
            // 必须是 instant：全局 scroll-behavior 是 smooth，平滑滚动会被
            // 下一次校正打断并从头开始，永远到不了目标位置。
            window.scrollTo({ top, behavior: 'instant' });
          }
        }

        if (Date.now() < deadline) timer = window.setTimeout(align, 100);
      };

      const stop = () => {
        window.clearTimeout(timer);
        timer = 0;
      };

      // 用户一旦主动滚动就交还控制权，不要把人拽回锚点。
      const options = { passive: true, once: true } as const;
      window.addEventListener('wheel', stop, options);
      window.addEventListener('touchstart', stop, options);
      window.addEventListener('keydown', stop, options);

      align();

      return () => {
        stop();
        window.removeEventListener('wheel', stop);
        window.removeEventListener('touchstart', stop);
        window.removeEventListener('keydown', stop);
      };
    }

    const target = main?.querySelector<HTMLElement>('h1') ?? main;
    target?.focus({ preventScroll: true });
  }, [matches, pathname, hash]);

  return null;
}
