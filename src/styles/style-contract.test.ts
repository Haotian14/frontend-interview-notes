import { describe, expect, test } from 'vitest';
import indexHtml from '../../index.html?raw';
import base from './base.css?raw';
import layout from './layout.css?raw';
import tokens from './tokens.css?raw';

describe('V2 style contract', () => {
  test('defines stable reading tokens', () => {
    for (const token of [
      '--color-paper',
      '--color-ink',
      '--color-accent',
      '--content-width',
      '--focus-ring',
    ]) {
      expect(tokens).toContain(token);
    }
  });

  test('supports visible focus and reduced motion', () => {
    expect(base).toContain(':focus-visible');
    expect(base).toContain('prefers-reduced-motion');
  });

  test('declares desktop, tablet and mobile breakpoints', () => {
    expect(layout).toContain('1120px');
    expect(layout).toContain('780px');
    expect(layout).toContain('500px');
  });

  test('does not load Google Fonts at runtime', () => {
    expect(indexHtml).not.toContain('fonts.googleapis.com');
    expect(indexHtml).not.toContain('fonts.gstatic.com');
  });

  /*
    深色规则要写两遍：媒体查询里排除手动选择的浅色，属性选择器让手动选择的
    深色在浅色系统下也生效。少写一半会造成「切了没反应」，所以在这里锁住。
  */
  test('defines a dark palette for both system preference and manual choice', () => {
    expect(tokens).toContain('@media (prefers-color-scheme: dark)');
    expect(tokens).toContain(":root:not([data-theme='light'])");
    expect(tokens).toContain(":root[data-theme='dark']");

    for (const token of ['--color-paper', '--color-ink', '--color-muted', '--focus-ring']) {
      // 三处：浅色基准 + 两处深色覆盖。
      expect(tokens.split(token).length - 1).toBeGreaterThanOrEqual(3);
    }
  });

  test('paints themed surfaces from tokens rather than fixed colors', () => {
    expect(base).toContain('var(--color-rule)');
    expect(layout).toContain('var(--color-header-bg)');
    expect(layout).toContain('var(--color-scrim)');
  });

  test('sets the theme before first paint to avoid a flash', () => {
    expect(indexHtml).toContain('handbook:theme:v1');
    expect(indexHtml).toContain('data-theme');
    expect(indexHtml).toContain('prefers-color-scheme: dark');
  });

  test('declares browser and home-screen icons', () => {
    expect(indexHtml).toContain('rel="icon" href="/favicon.svg"');
    expect(indexHtml).toContain('rel="icon" href="/favicon-32x32.png"');
    expect(indexHtml).toContain('rel="apple-touch-icon" href="/apple-touch-icon.png"');
  });
});
