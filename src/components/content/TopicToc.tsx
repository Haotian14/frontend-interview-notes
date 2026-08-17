import { useEffect, useState } from 'react';
import type { RefObject } from 'react';

type TocHeading = {
  id: string;
  label: string;
  level: 2 | 3;
};

export default function TopicToc({
  articleRef,
}: {
  articleRef: RefObject<HTMLElement | null>;
}) {
  const [headings, setHeadings] = useState<TocHeading[]>([]);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const elements = [...(articleRef.current?.querySelectorAll<HTMLHeadingElement>('h2, h3') ?? [])];

    const nextHeadings = elements.map((heading, index) => {
      if (!heading.id) heading.id = `section-${index + 1}`;
      return {
        id: heading.id,
        label: heading.textContent?.trim() || `第 ${index + 1} 节`,
        level: heading.tagName === 'H2' ? 2 as const : 3 as const,
      };
    });

    setHeadings(nextHeadings);
    setActiveId(nextHeadings[0]?.id ?? '');

    if (typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(entries => {
      const visible = entries.find(entry => entry.isIntersecting);
      if (visible) setActiveId((visible.target as HTMLElement).id);
    }, {
      rootMargin: '-20% 0px -65%',
    });

    elements.forEach(heading => observer.observe(heading));
    return () => observer.disconnect();
  }, [articleRef]);

  if (!headings.length) return null;

  return (
    <nav className="topic-toc" aria-label="本页目录">
      <strong>本页目录</strong>
      <ol>
        {headings.map(heading => (
          <li key={heading.id} data-level={heading.level}>
            <a
              href={`#${heading.id}`}
              aria-current={activeId === heading.id ? 'location' : undefined}
            >
              {heading.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
