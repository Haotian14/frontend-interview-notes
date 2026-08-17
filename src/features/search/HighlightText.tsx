import { Fragment } from 'react';

function escapePattern(value: string) {
  return value.replace(/[.*+?^$()|[\]\\{}]/g, '\\$&');
}

export default function HighlightText({
  text,
  query,
}: {
  text: string;
  query: string;
}) {
  const normalized = query.trim();
  if (!normalized) return <>{text}</>;

  const pattern = new RegExp(`(${escapePattern(normalized)})`, 'gi');
  return (
    <>
      {text.split(pattern).map((part, index) => (
        part.toLocaleLowerCase() === normalized.toLocaleLowerCase()
          ? <mark key={`${part}-${index}`}>{part}</mark>
          : <Fragment key={`${part}-${index}`}>{part}</Fragment>
      ))}
    </>
  );
}
