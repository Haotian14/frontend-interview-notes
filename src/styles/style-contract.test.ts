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

  test('declares browser and home-screen icons', () => {
    expect(indexHtml).toContain('rel="icon" href="/favicon.svg"');
    expect(indexHtml).toContain('rel="icon" href="/favicon-32x32.png"');
    expect(indexHtml).toContain('rel="apple-touch-icon" href="/apple-touch-icon.png"');
  });
});
