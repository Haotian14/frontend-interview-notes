/**
 * 主题偏好：和阅读进度一样只写本机 localStorage，不参与任何网络请求。
 *
 * 这是全站第二个、也是仅有的另一个允许触碰 localStorage 的模块
 * （由 scripts/verify-build.mjs 的允许名单强制）。index.html 里的防闪烁
 * 内联脚本必须读同一个键，改键名时两处要一起改。
 */

export const THEME_STORAGE_KEY = 'handbook:theme:v1';

/** system 表示跟随系统，不写 data-theme，由 prefers-color-scheme 决定。 */
export type ThemeChoice = 'system' | 'light' | 'dark';

export const themeChoices: ThemeChoice[] = ['system', 'light', 'dark'];

export const themeLabels: Record<ThemeChoice, string> = {
  system: '跟随系统',
  light: '浅色',
  dark: '深色',
};

function isThemeChoice(value: unknown): value is ThemeChoice {
  return typeof value === 'string' && (themeChoices as string[]).includes(value);
}

/** 预渲染在 Node 里执行、隐私模式下访问会抛异常，所以每次读写都要能安全失败。 */
function safeStorage(): Storage | null {
  try {
    if (typeof window === 'undefined') return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readTheme(): ThemeChoice {
  const storage = safeStorage();
  if (!storage) return 'system';

  try {
    const raw = storage.getItem(THEME_STORAGE_KEY);
    return isThemeChoice(raw) ? raw : 'system';
  } catch {
    return 'system';
  }
}

export function writeTheme(choice: ThemeChoice): void {
  const storage = safeStorage();
  if (!storage) return;

  try {
    if (choice === 'system') {
      storage.removeItem(THEME_STORAGE_KEY);
    } else {
      storage.setItem(THEME_STORAGE_KEY, choice);
    }
  } catch {
    // 配额用尽或被禁用：静默降级为跟随系统。
  }
}

/**
 * 把选择写到根元素上。CSS 的深色规则写成
 * `:root[data-theme="dark"]` 与 `@media (prefers-color-scheme: dark)
 * :root:not([data-theme="light"])`，所以 system 状态下要移除属性。
 */
export function applyTheme(choice: ThemeChoice): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  if (choice === 'system') {
    delete root.dataset.theme;
  } else {
    root.dataset.theme = choice;
  }
}

export function nextTheme(choice: ThemeChoice): ThemeChoice {
  return themeChoices[(themeChoices.indexOf(choice) + 1) % themeChoices.length];
}
