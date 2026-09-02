import { themeLabels, nextTheme } from './themeStore';
import { useTheme } from './useTheme';

const icons = {
  system: '◐',
  light: '○',
  dark: '●',
} as const;

/**
 * 三态循环：跟随系统 → 浅色 → 深色。hydrate 阶段固定显示「跟随系统」，
 * 与预渲染 HTML 一致；真实选择由 index.html 的内联脚本在首次绘制前就
 * 写到了 <html data-theme> 上，所以按钮文案短暂不同步不会造成闪烁。
 */
export default function ThemeToggle() {
  const { choice, cycle } = useTheme();

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={cycle}
      aria-label={`外观：${themeLabels[choice]}，切换到${themeLabels[nextTheme(choice)]}`}
      title={`外观：${themeLabels[choice]}`}
    >
      <span aria-hidden="true">{icons[choice]}</span>
      <span className="theme-toggle__label">{themeLabels[choice]}</span>
    </button>
  );
}
