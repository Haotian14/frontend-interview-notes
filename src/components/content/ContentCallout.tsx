import type { PropsWithChildren } from 'react';

type ContentCalloutProps = PropsWithChildren<{
  title?: string;
  variant?: 'conclusion' | 'note' | 'warning';
}>;

export default function ContentCallout({
  children,
  title = '提示',
  variant = 'note',
}: ContentCalloutProps) {
  return (
    <aside className={`content-callout content-callout--${variant}`} role="note">
      <strong>{title}</strong>
      <div>{children}</div>
    </aside>
  );
}
