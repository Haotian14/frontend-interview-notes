import { useCallback, useSyncExternalStore } from 'react';
import {
  applyTheme,
  nextTheme,
  readTheme,
  writeTheme,
} from './themeStore';
import type { ThemeChoice } from './themeStore';

/**
 * 主题和阅读进度一样是组件树之外的状态，用 useSyncExternalStore 订阅：
 * 服务端快照固定为 'system'，与预渲染 HTML 一致；监听 storage 事件后
 * 多个标签页之间的选择自动同步。
 */

const listeners = new Set<() => void>();

// getSnapshot 必须返回稳定引用，字符串天然稳定，缓存只是为了少读一次存储。
let snapshot: ThemeChoice = readTheme();

function emit() {
  snapshot = readTheme();
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

function getServerSnapshot(): ThemeChoice {
  return 'system';
}

export function useTheme() {
  const choice = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setChoice = useCallback((next: ThemeChoice) => {
    writeTheme(next);
    applyTheme(next);
    emit();
  }, []);

  const cycle = useCallback(() => {
    setChoice(nextTheme(readTheme()));
  }, [setChoice]);

  return { choice, setChoice, cycle };
}
