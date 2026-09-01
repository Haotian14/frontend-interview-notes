import type { TopicMeta } from '../../../types';

export const meta: TopicMeta = {
  slug: 'responsive-images',
  chapter: 'html-a11y',
  order: 3,
  title: '响应式图片与媒体加载',
  summary: '用 srcset、sizes、picture 和加载属性控制图片选择与时机，同时避免布局偏移和无意义的替代文本。',
  level: '基础',
  minutes: 22,
  keywords: ['srcset', 'sizes', 'picture', 'lazy loading', 'alt', '布局偏移'],
  prerequisites: ['semantic-accessibility'],
  related: ['semantic-accessibility', 'web-vitals'],
  sources: [
    { label: 'MDN — Responsive images', href: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images' },
    { label: 'HTML Standard — Images', href: 'https://html.spec.whatwg.org/multipage/images.html' },
  ],
  searchText: '响应式图片 srcset sizes picture source type loading lazy decoding async fetchpriority alt 替代文本 装饰性图片 aspect-ratio 布局偏移 CLS 预加载扫描器 preload scanner',
  hasCode: true,
};
