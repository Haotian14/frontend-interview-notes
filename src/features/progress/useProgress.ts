import { useCallback, useSyncExternalStore } from 'react';
import {
  clearProgress,
  readProgress,
  toggleRead,
  writeProgress,
} from './progressStore';
import type { ProgressState } from './progressStore';

const EMPTY: ProgressState = { read: [] };

/**
 * 进度是组件树之外的状态（浏览器本地存储），因此用 useSyncExternalStore 订阅，
 * 而不是在 effect 里 setState。这样做还带来两个好处：
 * 服务端快照固定为空，与预渲染 HTML 一致，不会 hydrate 失配；
 * 监听 storage 事件后，多个标签页之间的进度自动同步。
 */

const listeners = new Set<() => void>();

// getSnapshot 必须返回稳定引用，否则会触发无限重渲染，所以在这里缓存。
let snapshot: ProgressState = readProgress();

function emit() {
  snapshot = readProgress();
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener('storage', emit);

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener('storage', emit);
  };
}

function getSnapshot() {
  return snapshot;
}

function getServerSnapshot() {
  return EMPTY;
}

export function useProgress() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback((slug: string) => {
    writeProgress(toggleRead(readProgress(), slug));
    emit();
  }, []);

  const reset = useCallback(() => {
    clearProgress();
    emit();
  }, []);

  const isRead = useCallback(
    (slug: string) => state.read.includes(slug),
    [state],
  );

  return { readSlugs: state.read, isRead, toggle, reset };
}
