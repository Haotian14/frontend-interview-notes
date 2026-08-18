/**
 * 阅读进度：只写本机 localStorage，不参与任何网络请求。
 *
 * 这是全站唯一允许触碰 localStorage 的模块（由 scripts/verify-build.mjs 强制），
 * 目的是让"存了什么、存在哪"始终只有一个可审计的位置。
 */

const STORAGE_KEY = 'handbook:progress:v1';

export type ProgressState = {
  /** 已标记读完的专题 slug。 */
  read: string[];
};

const EMPTY: ProgressState = { read: [] };

/**
 * 预渲染在 Node 里执行、隐私模式下访问会抛异常，所以每次读写都要能安全失败：
 * 进度丢失只是体验降级，不该让整页崩溃。
 */
function safeStorage(): Storage | null {
  try {
    if (typeof window === 'undefined') return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readProgress(): ProgressState {
  const storage = safeStorage();
  if (!storage) return EMPTY;

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;

    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      !Array.isArray((parsed as ProgressState).read)
    ) {
      return EMPTY;
    }

    // 存储内容可能来自旧版本或被手工改过，逐项校验后才采信。
    const read = (parsed as ProgressState).read.filter(
      (slug): slug is string => typeof slug === 'string',
    );
    return { read };
  } catch {
    return EMPTY;
  }
}

export function writeProgress(state: ProgressState): void {
  const storage = safeStorage();
  if (!storage) return;

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // 配额用尽或被禁用：静默降级。
  }
}

export function toggleRead(state: ProgressState, slug: string): ProgressState {
  const read = state.read.includes(slug)
    ? state.read.filter(entry => entry !== slug)
    : [...state.read, slug];

  return { read };
}

export function clearProgress(): void {
  const storage = safeStorage();
  if (!storage) return;

  try {
    storage.removeItem(STORAGE_KEY);
  } catch {
    // 同上。
  }
}
