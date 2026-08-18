import { useProgress } from './useProgress';

/** 「读完了」开关。进度来自 useSyncExternalStore，hydrate 阶段固定为未选中。 */
export default function ReadToggle({ slug }: { slug: string }) {
  const { isRead, toggle } = useProgress();
  const done = isRead(slug);

  return (
    <button
      type="button"
      className="read-toggle"
      aria-pressed={done}
      onClick={() => toggle(slug)}
    >
      <span aria-hidden="true">{done ? '✓' : '○'}</span>
      {done ? '已读完' : '标记为读完'}
    </button>
  );
}
