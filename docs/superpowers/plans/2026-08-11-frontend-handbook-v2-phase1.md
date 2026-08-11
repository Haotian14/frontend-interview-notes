# 前端复习手册 V2 第一阶段实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** 建立可扩展的 V2 内容与阅读基础设施，并交付八篇达到统一质量标准的样板专题。

**Architecture:** 保留 Vite、React、TypeScript 与 Sites Worker，使用 React Router 提供真实页面路由，使用按专题目录拆分的 MDX 文件作为内容源。元数据清单负责导航、关联、搜索和构建检查，文章正文按路由动态加载。

**Tech Stack:** React 19、TypeScript 5.9、Vite 7、React Router、MDX、Fuse.js、Shiki、Vitest、React Testing Library、Playwright、Cloudflare Worker ESM。

## Global Constraints

- 不实现账户、收藏、打卡、学习进度或任何浏览器持久化。
- 保留暖白、墨黑、荧光绿品牌语言，但长文正文最大宽度为 760px。
- 所有专题必须有稳定 URL，并支持直接刷新、前进和后退。
- 专题状态只使用“基础”“高频”“进阶”三种标签。
- 八篇样板文章必须包含结论、前置知识、核心机制、验证材料、项目应用、边界、面试回答、追问、关联专题和官方资料。
- 运行时不得请求 Google Fonts；字体资源必须由应用本地打包。
- 首屏 JavaScript gzip 后不得超过 100KB，不包含按需加载的专题内容。
- 所有新增交互必须可键盘操作，支持可见焦点和 prefers-reduced-motion。
- 每个任务遵循测试先行：先写失败测试，确认失败，再写最小实现。
- 实施时使用独立分支 agent/frontend-handbook-v2-phase1；每个任务通过验收后立即提交并执行 git push origin HEAD，不把多个任务积压到一次推送。

---

## Planned File Structure

~~~text
src/
├─ app/
│  ├─ App.tsx
│  ├─ router.tsx
│  ├─ AppShell.tsx
│  ├─ RouteFocus.tsx
│  ├─ RootErrorBoundary.tsx
│  └─ pages/
│     ├─ HomePage.tsx
│     ├─ HandbookPage.tsx
│     ├─ ChapterPage.tsx
│     ├─ TopicPage.tsx
│     ├─ InterviewPage.tsx
│     ├─ CodePage.tsx
│     ├─ ReferencePage.tsx
│     └─ NotFoundPage.tsx
├─ components/content/
│  ├─ TopicLayout.tsx
│  ├─ TopicToc.tsx
│  ├─ ContentCallout.tsx
│  ├─ CopyCodeButton.tsx
│  └─ RelatedTopics.tsx
├─ content/
│  ├─ types.ts
│  ├─ chapters.ts
│  ├─ validate.ts
│  ├─ registry.ts
│  └─ topics/<chapter>/<slug>/
│     ├─ meta.ts
│     └─ article.mdx
├─ features/search/
│  ├─ searchIndex.ts
│  ├─ SearchDialog.tsx
│  └─ HighlightText.tsx
├─ features/interview/
│  ├─ questionBank.ts
│  └─ InterviewDeck.tsx
├─ styles/
│  ├─ tokens.css
│  ├─ base.css
│  ├─ layout.css
│  ├─ content.css
│  └─ components.css
├─ test/setup.ts
└─ main.tsx
worker/index.ts
tests/e2e/handbook.spec.ts
~~~

The current src/App.tsx, src/App.css, src/index.css, and src/data.ts remain in place until their replacements pass tests. Remove them only in Task 13.

---

### Task 1: Add the V2 Runtime and Test Toolchain

**Files:**
- Modify: package.json
- Modify: package-lock.json
- Modify: vite.config.ts
- Modify: tsconfig.app.json
- Create: src/test/setup.ts
- Create: src/test/baseline.test.tsx

**Interfaces:**
- Produces: Vitest DOM environment, MDX Vite transform, package scripts test, test:watch, test:content, test:e2e.
- Consumes: existing Vite React application.

- [ ] **Step 1: Install runtime and development dependencies**

Run:

~~~powershell
npm.cmd install react-router-dom @mdx-js/react fuse.js @fontsource-variable/noto-sans-sc @fontsource/dm-mono
npm.cmd install --save-dev @mdx-js/rollup remark-gfm rehype-slug rehype-pretty-code shiki unist-util-visit vitest jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom @playwright/test esbuild sharp
~~~

Expected: package.json and package-lock.json record all dependencies without peer dependency errors.

- [ ] **Step 2: Add a baseline render test**

Create src/test/baseline.test.tsx:

~~~tsx
import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders the existing handbook before migration', () => {
  render(<App />);
  expect(screen.getByText('前端工程师')).toBeInTheDocument();
});
~~~

- [ ] **Step 3: Run the test and confirm the test environment is missing**

Run:

~~~powershell
npx.cmd vitest run src/test/baseline.test.tsx
~~~

Expected: FAIL because jest-dom matchers or jsdom setup is not configured.

- [ ] **Step 4: Configure Vitest and MDX**

Create src/test/setup.ts:

~~~ts
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(cleanup);
~~~

Update vite.config.ts to apply MDX before React and configure tests:

~~~ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypePrettyCode from 'rehype-pretty-code';

export default defineConfig({
  plugins: [
    mdx({
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        [rehypePrettyCode, { theme: 'github-dark-default' }],
      ],
    }),
    react(),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
});
~~~

Add package scripts:

~~~json
"test": "vitest run",
"test:watch": "vitest",
"test:content": "vitest run src/content",
"test:e2e": "playwright test"
~~~

- [ ] **Step 5: Run the baseline checks**

Run:

~~~powershell
npm.cmd test -- src/test/baseline.test.tsx
npm.cmd run typecheck
~~~

Expected: both commands PASS.

- [ ] **Step 6: Commit**

~~~powershell
git add package.json package-lock.json vite.config.ts tsconfig.app.json src/test
git commit -m "test: add v2 test and content toolchain"
git push origin HEAD
~~~

---

### Task 2: Define and Validate the Content Contract

**Files:**
- Create: src/content/types.ts
- Create: src/content/chapters.ts
- Create: src/content/validate.ts
- Create: src/content/validate.test.ts

**Interfaces:**
- Produces: TopicMeta, Chapter, ValidationIssue, validateContent(topics, chapters).
- Consumes: no earlier application interfaces.

- [ ] **Step 1: Write failing contract tests**

Create src/content/validate.test.ts:

~~~ts
import { describe, expect, test } from 'vitest';
import { validateContent } from './validate';
import type { Chapter, TopicMeta } from './types';

const chapters: Chapter[] = [
  { id: 'javascript', index: 3, title: 'JavaScript 语言核心', summary: '语言机制' },
];

const validTopic: TopicMeta = {
  slug: 'scope-closure',
  chapter: 'javascript',
  order: 1,
  title: '作用域与闭包',
  summary: '理解词法环境与闭包。',
  level: '高频',
  minutes: 18,
  keywords: ['作用域', '闭包'],
  prerequisites: [],
  related: [],
  sources: [{ label: 'MDN Closures', href: 'https://developer.mozilla.org/docs/Web/JavaScript/Guide/Closures' }],
  searchText: '词法作用域 环境记录 私有状态',
  hasCode: true,
  interview: {
    answer: '闭包让函数保留定义时的词法环境。',
    followUps: ['闭包何时被回收？', '闭包一定泄漏吗？'],
  },
};

describe('validateContent', () => {
  test('accepts a complete topic', () => {
    expect(validateContent([validTopic], chapters)).toEqual([]);
  });

  test('reports duplicate slugs, unknown chapters and broken links', () => {
    const broken = {
      ...validTopic,
      chapter: 'missing',
      prerequisites: ['not-found'],
      sources: [],
    };
    const messages = validateContent([validTopic, broken], chapters).map(issue => issue.message);
    expect(messages).toContain('重复专题 slug：scope-closure');
    expect(messages).toContain('未知章节：missing');
    expect(messages).toContain('无效前置专题：not-found');
    expect(messages).toContain('专题 scope-closure 缺少资料来源');
  });

  test('reports duplicate order and incomplete search/interview metadata', () => {
    const second = {
      ...validTopic,
      slug: 'second-topic',
      searchText: '',
      interview: { ...validTopic.interview, followUps: [] },
    };
    const messages = validateContent([validTopic, second], chapters).map(issue => issue.message);
    expect(messages).toContain('章节内顺序重复：javascript:1');
    expect(messages).toContain('专题缺少搜索文本：second-topic');
    expect(messages).toContain('追问数量必须为 2 至 4：second-topic');
  });
});
~~~

- [ ] **Step 2: Run the tests and confirm failure**

Run:

~~~powershell
npm.cmd test -- src/content/validate.test.ts
~~~

Expected: FAIL because types.ts and validate.ts do not exist.

- [ ] **Step 3: Implement content types**

Create src/content/types.ts:

~~~ts
import type { ComponentType } from 'react';

export type TopicLevel = '基础' | '高频' | '进阶';

export type ContentSource = {
  label: string;
  href: string;
};

export type TopicMeta = {
  slug: string;
  chapter: string;
  order: number;
  title: string;
  summary: string;
  level: TopicLevel;
  minutes: number;
  keywords: string[];
  prerequisites: string[];
  related: string[];
  sources: ContentSource[];
  searchText: string;
  hasCode: boolean;
  interview: {
    answer: string;
    followUps: string[];
  };
};

export type Chapter = {
  id: string;
  index: number;
  title: string;
  summary: string;
};

export type TopicModule = {
  default: ComponentType;
};

export type ValidationIssue = {
  topic?: string;
  message: string;
};
~~~

- [ ] **Step 4: Define all ten chapters**

Create src/content/chapters.ts with IDs in this exact order:

~~~ts
import type { Chapter } from './types';

export const chapters: Chapter[] = [
  { id: 'html-a11y', index: 1, title: 'HTML、语义化与可访问性', summary: '构建有意义、可操作的页面结构。' },
  { id: 'css', index: 2, title: 'CSS 布局、渲染与工程化', summary: '理解布局、层叠和可维护样式。' },
  { id: 'javascript-core', index: 3, title: 'JavaScript 语言核心', summary: '掌握执行上下文、对象模型与类型语义。' },
  { id: 'javascript-async', index: 4, title: 'JavaScript 异步与 Web API', summary: '理解事件循环、并发与浏览器 API。' },
  { id: 'typescript', index: 5, title: 'TypeScript 类型系统', summary: '用类型表达约束与数据关系。' },
  { id: 'react', index: 6, title: 'React 原理与应用架构', summary: '理解渲染、状态与组件边界。' },
  { id: 'browser-network', index: 7, title: '浏览器与网络', summary: '连接导航、协议、缓存与渲染。' },
  { id: 'quality', index: 8, title: '性能、安全与稳定性', summary: '建立可衡量、可防护的质量体系。' },
  { id: 'engineering', index: 9, title: '构建、测试与工程体系', summary: '控制交付过程和变化成本。' },
  { id: 'interview', index: 10, title: '手写题、项目设计与面试表达', summary: '把理解转成实现与清晰表达。' },
];
~~~

- [ ] **Step 5: Implement validation**

Implement validateContent in src/content/validate.ts. It must return one issue for each duplicate slug, duplicate order inside a chapter, unknown chapter, missing prerequisite, missing related topic, empty keyword list, invalid reading time, empty search text, fewer than two or more than four follow-ups, non-HTTPS source, or empty sources array. Never throw inside validateContent.

~~~ts
import type { Chapter, TopicMeta, ValidationIssue } from './types';

export function validateContent(topics: TopicMeta[], chapters: Chapter[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const chapterIds = new Set(chapters.map(chapter => chapter.id));
  const slugs = new Set(topics.map(topic => topic.slug));
  const counts = new Map<string, number>();
  const orderCounts = new Map<string, number>();

  for (const topic of topics) {
    counts.set(topic.slug, (counts.get(topic.slug) ?? 0) + 1);
    const orderKey = topic.chapter + ':' + topic.order;
    orderCounts.set(orderKey, (orderCounts.get(orderKey) ?? 0) + 1);
  }

  for (const topic of topics) {
    if ((counts.get(topic.slug) ?? 0) > 1) {
      issues.push({ topic: topic.slug, message: '重复专题 slug：' + topic.slug });
    }
    const orderKey = topic.chapter + ':' + topic.order;
    if ((orderCounts.get(orderKey) ?? 0) > 1) {
      issues.push({ topic: topic.slug, message: '章节内顺序重复：' + orderKey });
    }
    if (!chapterIds.has(topic.chapter)) {
      issues.push({ topic: topic.slug, message: '未知章节：' + topic.chapter });
    }
    for (const slug of topic.prerequisites) {
      if (!slugs.has(slug)) issues.push({ topic: topic.slug, message: '无效前置专题：' + slug });
    }
    for (const slug of topic.related) {
      if (!slugs.has(slug)) issues.push({ topic: topic.slug, message: '无效关联专题：' + slug });
    }
    if (!topic.sources.length) {
      issues.push({ topic: topic.slug, message: '专题 ' + topic.slug + ' 缺少资料来源' });
    }
    if (!topic.keywords.length) issues.push({ topic: topic.slug, message: '专题缺少关键词：' + topic.slug });
    if (topic.minutes < 1) issues.push({ topic: topic.slug, message: '阅读时间无效：' + topic.slug });
    if (!topic.searchText.trim()) issues.push({ topic: topic.slug, message: '专题缺少搜索文本：' + topic.slug });
    if (topic.interview.followUps.length < 2 || topic.interview.followUps.length > 4) {
      issues.push({ topic: topic.slug, message: '追问数量必须为 2 至 4：' + topic.slug });
    }
    for (const source of topic.sources) {
      if (!source.href.startsWith('https://')) {
        issues.push({ topic: topic.slug, message: '资料链接必须使用 HTTPS：' + source.href });
      }
    }
  }
  return issues;
}
~~~

- [ ] **Step 6: Run tests and commit**

Run:

~~~powershell
npm.cmd test -- src/content/validate.test.ts
npm.cmd run typecheck
~~~

Expected: PASS.

~~~powershell
git add src/content
git commit -m "feat: define validated content contract"
git push origin HEAD
~~~

---

### Task 3: Build the MDX Registry and Topic Loading

**Files:**
- Create: src/content/registry.ts
- Create: src/content/registry.test.ts
- Create: src/mdx.d.ts
- Create: src/content/topics/javascript-async/event-loop/meta.ts
- Create: src/content/topics/javascript-async/event-loop/article.mdx

**Interfaces:**
- Consumes: TopicMeta, TopicModule, chapters, validateContent.
- Produces: topics, getTopic(slug), getChapterTopics(chapterId), loadTopic(slug), getAdjacentTopics(slug).

- [ ] **Step 1: Write failing registry tests**

Create src/content/registry.test.ts:

~~~ts
import { describe, expect, test } from 'vitest';
import { getAdjacentTopics, getChapterTopics, getTopic, loadTopic, topics } from './registry';

describe('content registry', () => {
  test('registers the event loop topic', () => {
    expect(getTopic('event-loop')?.title).toBe('事件循环与任务队列');
    expect(getChapterTopics('javascript-async')).toHaveLength(1);
    expect(topics).toHaveLength(1);
  });

  test('loads the MDX module lazily', async () => {
    const module = await loadTopic('event-loop');
    expect(module.default).toBeTypeOf('function');
  });

  test('returns adjacent topics without throwing at boundaries', () => {
    expect(getAdjacentTopics('event-loop')).toEqual({ previous: undefined, next: undefined });
  });
});
~~~

- [ ] **Step 2: Run and confirm failure**

Run:

~~~powershell
npm.cmd test -- src/content/registry.test.ts
~~~

Expected: FAIL because registry.ts and topic files do not exist.

- [ ] **Step 3: Add MDX module typing and the first metadata module**

Create src/mdx.d.ts:

~~~ts
declare module '*.mdx' {
  import type { ComponentType } from 'react';
  const Component: ComponentType;
  export default Component;
}
~~~

Create event-loop/meta.ts:

~~~ts
import type { TopicMeta } from '../../../types';

export const meta: TopicMeta = {
  slug: 'event-loop',
  chapter: 'javascript-async',
  order: 1,
  title: '事件循环与任务队列',
  summary: '从调用栈、任务、微任务和渲染时机解释异步代码的执行顺序。',
  level: '高频',
  minutes: 24,
  keywords: ['调用栈', '任务', '微任务', '渲染'],
  prerequisites: [],
  related: [],
  sources: [
    { label: 'HTML Standard — Event loops', href: 'https://html.spec.whatwg.org/multipage/webappapis.html#event-loops' },
    { label: 'MDN — Microtask guide', href: 'https://developer.mozilla.org/docs/Web/API/HTML_DOM_API/Microtask_guide' },
  ],
  searchText: '调用栈 任务 微任务 Promise 计时器 渲染机会 长任务',
  hasCode: true,
  interview: {
    answer: '一轮事件循环执行一个任务，清空全部微任务，再进入可能的渲染阶段。',
    followUps: ['为什么微任务会饿死渲染？', 'requestAnimationFrame 在什么时机执行？'],
  },
};
~~~

Create article.mdx with all required headings:

~~~~mdx
# 事件循环与任务队列

## 一句话结论

事件循环让单线程 JavaScript 在不阻塞整个页面的情况下协调任务、微任务和渲染机会。

## 前置知识

先理解调用栈和 Promise 的状态变化。

## 核心机制

当前任务先执行到调用栈清空，随后浏览器清空微任务队列，再决定是否进行渲染并进入下一个任务。

## 最小验证

~~~js
console.log('A');
setTimeout(() => console.log('B'));
Promise.resolve().then(() => console.log('C'));
console.log('D');
// A D C B
~~~

## 项目应用

长任务会延迟输入响应；持续创建微任务也会让渲染和后续任务得不到执行机会。

## 边界与反例

“微任务永远先于宏任务”并不准确，因为当前同步脚本本身就在一个任务中。

## 面试回答

一轮事件循环执行一个任务，清空期间产生的全部微任务，再进入可能的渲染阶段，因此 Promise 回调通常早于计时器回调。

## 深度追问

1. 为什么递归创建微任务会影响页面渲染？
2. requestAnimationFrame 位于哪个阶段？

## 资料来源

- [HTML Standard — Event loops](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops)
- [MDN — Microtask guide](https://developer.mozilla.org/docs/Web/API/HTML_DOM_API/Microtask_guide)
~~~~

- [ ] **Step 4: Implement the registry**

Use two globs: eager metadata and lazy MDX. Normalize both paths to chapter/slug keys and throw once at module initialization if validateContent reports any issue.

~~~ts
import { chapters } from './chapters';
import type { TopicMeta, TopicModule } from './types';
import { validateContent } from './validate';

const metadata = import.meta.glob<{ meta: TopicMeta }>('./topics/**/meta.ts', { eager: true });
const articles = import.meta.glob<TopicModule>('./topics/**/article.mdx');

export const topics = Object.values(metadata)
  .map(module => module.meta)
  .sort((a, b) => {
    const chapterOrder = chapters.findIndex(chapter => chapter.id === a.chapter) -
      chapters.findIndex(chapter => chapter.id === b.chapter);
    return chapterOrder || a.order - b.order;
  });

const issues = validateContent(topics, chapters);
if (issues.length) throw new Error(issues.map(issue => issue.message).join('\n'));

export function getTopic(slug: string) {
  return topics.find(topic => topic.slug === slug);
}

export function getChapterTopics(chapterId: string) {
  return topics.filter(topic => topic.chapter === chapterId);
}

export async function loadTopic(slug: string) {
  const entry = Object.entries(articles).find(([path]) => path.endsWith('/' + slug + '/article.mdx'));
  if (!entry) throw new Error('找不到专题内容：' + slug);
  return entry[1]();
}

export function getAdjacentTopics(slug: string) {
  const index = topics.findIndex(topic => topic.slug === slug);
  return {
    previous: index > 0 ? topics[index - 1] : undefined,
    next: index >= 0 && index < topics.length - 1 ? topics[index + 1] : undefined,
  };
}
~~~

- [ ] **Step 5: Run tests and commit**

~~~powershell
npm.cmd test -- src/content/registry.test.ts
npm.cmd run typecheck
git add src/content src/mdx.d.ts
git commit -m "feat: add lazy mdx content registry"
git push origin HEAD
~~~

Expected: tests and typecheck PASS.

---

### Task 4: Add the HTML, CSS, and TypeScript Sample Articles

**Files:**
- Create: src/content/topics/html-a11y/semantic-accessibility/meta.ts
- Create: src/content/topics/html-a11y/semantic-accessibility/article.mdx
- Create: src/content/topics/css/stacking-context/meta.ts
- Create: src/content/topics/css/stacking-context/article.mdx
- Create: src/content/topics/typescript/type-narrowing/meta.ts
- Create: src/content/topics/typescript/type-narrowing/article.mdx
- Modify: src/content/registry.test.ts

**Interfaces:**
- Consumes: TopicMeta and registry globs.
- Produces: three valid sample topics and related links.

- [ ] **Step 1: Extend registry tests before adding content**

Add:

~~~ts
test('registers the first four sample topics', () => {
  expect(topics.map(topic => topic.slug)).toEqual(expect.arrayContaining([
    'semantic-accessibility',
    'stacking-context',
    'event-loop',
    'type-narrowing',
  ]));
  expect(topics).toHaveLength(4);
});
~~~

- [ ] **Step 2: Run and confirm failure**

Run npm.cmd test -- src/content/registry.test.ts.

Expected: FAIL with received topic count 1.

- [ ] **Step 3: Write semantic-accessibility**

Metadata: chapter html-a11y, order 1, level 基础, 20 minutes, keywords 语义化/ARIA/键盘/表单, hasCode true. searchText must include accessible name, role, state, focus order and form error. interview contains the final 90-second answer and three follow-ups. Sources: HTML Standard semantics and WAI-ARIA Authoring Practices.

The article must explicitly explain:

- Native semantics before ARIA.
- Accessible name, role, state and keyboard behavior.
- Correct button versus div comparison table.
- A labeled form error example using aria-describedby.
- Project checklist for focus order, alt text and 200% zoom.
- Interview answer and three follow-ups.

- [ ] **Step 4: Write stacking-context**

Metadata: chapter css, order 1, level 高频, 24 minutes, keywords 层叠上下文/z-index/定位/合成层, hasCode true. searchText covers stacking order, containing contexts and compositing layers. interview contains the final answer and three follow-ups. Related: semantic-accessibility. Sources: MDN Stacking context and CSS Positioned Layout specification.

The article must explicitly explain:

- Stacking order inside one context.
- Conditions that create new contexts.
- Why a large child z-index cannot escape a lower parent context.
- A two-column HTML/CSS reproduction with a corrected version.
- Difference between stacking context and compositing layer.
- Interview answer and three follow-ups.

- [ ] **Step 5: Write type-narrowing**

Metadata: chapter typescript, order 1, level 高频, 24 minutes, keywords unknown/类型守卫/可辨识联合/never, hasCode true. searchText covers assertions, runtime validation and exhaustive checks. interview contains the final answer and three follow-ups. Sources: TypeScript Handbook Narrowing and Unions.

The article must explicitly explain:

- unknown versus any.
- typeof, in, instanceof and custom predicates.
- A discriminated union for request states.
- A never exhaustive-check function.
- Why assertions do not validate API responses.
- Interview answer and three follow-ups.

- [ ] **Step 6: Add reciprocal related links and run checks**

Set related links so semantic-accessibility points to stacking-context, stacking-context points to semantic-accessibility, and type-narrowing points to event-loop. Update event-loop/meta.ts to point to type-narrowing.

Run:

~~~powershell
npm.cmd test -- src/content
npm.cmd run typecheck
~~~

Expected: PASS.

- [ ] **Step 7: Commit**

~~~powershell
git add src/content
git commit -m "content: add html css and typescript samples"
git push origin HEAD
~~~

---

### Task 5: Add the React, Browser, Network, and Testing Sample Articles

**Files:**
- Create: src/content/topics/react/render-state-snapshot/meta.ts
- Create: src/content/topics/react/render-state-snapshot/article.mdx
- Create: src/content/topics/browser-network/rendering-pipeline/meta.ts
- Create: src/content/topics/browser-network/rendering-pipeline/article.mdx
- Create: src/content/topics/browser-network/http-cache/meta.ts
- Create: src/content/topics/browser-network/http-cache/article.mdx
- Create: src/content/topics/engineering/testing-strategy/meta.ts
- Create: src/content/topics/engineering/testing-strategy/article.mdx
- Modify: src/content/registry.test.ts

**Interfaces:**
- Consumes: TopicMeta and registry.
- Produces: a complete set of eight sample topics.

- [ ] **Step 1: Add the failing eight-topic assertion**

~~~ts
test('contains exactly eight phase-one sample topics', () => {
  expect(topics).toHaveLength(8);
  expect(topics.map(topic => topic.slug)).toEqual(expect.arrayContaining([
    'render-state-snapshot',
    'rendering-pipeline',
    'http-cache',
    'testing-strategy',
  ]));
});
~~~

Run the registry test and expect received count 4.

- [ ] **Step 2: Write render-state-snapshot**

Metadata: React, order 1, 高频, 26 minutes, hasCode true. searchText covers render snapshot, batching, component identity and derived state. interview contains the final answer and three follow-ups. Sources: React official documentation “State as a Snapshot” and “Queueing a Series of State Updates”.

Required content:

- Render as a pure UI snapshot.
- State identity tied to tree position, type and key.
- Direct update versus functional update code comparison.
- Batching and the update queue.
- Derived state anti-pattern.
- Interview answer and three follow-ups.

- [ ] **Step 3: Write rendering-pipeline**

Metadata: browser-network, order 1, 高频, 28 minutes, hasCode true. searchText covers DOM, CSSOM, style, layout, paint, composite and forced layout. interview contains the final answer and three follow-ups. Sources: HTML Standard parsing and web.dev rendering performance.

Required content:

- URL retrieval summary followed by DOM/CSSOM construction.
- Style, layout, paint and composite dependency flow.
- A table of property changes and likely pipeline stages.
- Forced synchronous layout example and corrected read/write grouping.
- Difference between a rendering opportunity and guaranteed rendering.
- Interview answer and three follow-ups.

- [ ] **Step 4: Write http-cache**

Metadata: browser-network, order 2, 高频, 26 minutes, hasCode false. searchText covers freshness, validators, Cache-Control, ETag and 304. interview contains the final answer and four follow-ups. Sources: RFC 9111 and MDN HTTP caching.

Required content:

- Freshness using Cache-Control.
- Validators using ETag and Last-Modified.
- 200 memory/disk cache versus 304 network validation.
- HTML short validation plus hashed immutable assets deployment strategy.
- private, public, no-cache and no-store comparison table.
- Interview answer and four follow-ups.

- [ ] **Step 5: Write testing-strategy**

Metadata: engineering, order 1, 进阶, 24 minutes, hasCode true. searchText covers test levels, risk, role queries, mocks and coverage. interview contains the final answer and three follow-ups. Sources: Testing Library guiding principles, Vitest guide and Playwright best practices.

Required content:

- Risk and feedback speed as test-level selection criteria.
- Unit, component/integration and E2E responsibility table.
- Role-based query example.
- Mock external boundaries, not the implementation under test.
- Coverage limitations and regression-based prioritization.
- Interview answer and three follow-ups.

- [ ] **Step 6: Complete related links and validate**

Every sample topic must have at least one related topic unless there is no meaningful relationship. Use these connections:

- render-state-snapshot ↔ type-narrowing
- rendering-pipeline ↔ stacking-context
- http-cache ↔ rendering-pipeline
- testing-strategy ↔ semantic-accessibility

Run:

~~~powershell
npm.cmd test -- src/content
npm.cmd run typecheck
~~~

Expected: PASS with eight topics.

- [ ] **Step 7: Commit**

~~~powershell
git add src/content
git commit -m "content: complete phase-one sample articles"
git push origin HEAD
~~~

---

### Task 6: Establish Route Paths and Worker Fallback

**Files:**
- Create: src/app/paths.ts
- Create: src/app/paths.test.ts
- Create: worker/index.ts
- Create: worker/index.test.ts
- Modify: scripts/build-worker.mjs

**Interfaces:**
- Produces: chapterPath(chapter), topicPath(topic), static route constants, Worker default fetch handler.
- Consumes: React Router and Sites ASSETS binding.

- [ ] **Step 1: Write failing path tests**

Verify URL generation is centralized and properly encodes parameters.

~~~tsx
test('builds chapter and topic paths', () => {
  expect(chapterPath('javascript-async')).toBe('/handbook/javascript-async');
  expect(topicPath({ chapter: 'javascript-async', slug: 'event-loop' }))
    .toBe('/handbook/javascript-async/event-loop');
});

test('encodes unsafe path characters', () => {
  expect(chapterPath('css layout')).toBe('/handbook/css%20layout');
});
~~~

- [ ] **Step 2: Run and confirm failure**

Run npm.cmd test -- src/app/paths.test.ts.

Expected: FAIL because paths.ts does not exist.

- [ ] **Step 3: Implement path helpers**

Export HOME_PATH, HANDBOOK_PATH, KNOWLEDGE_MAP_PATH, INTERVIEW_PATH, CODE_PATH and REFERENCE_PATH constants. Implement chapterPath and topicPath with encodeURIComponent. Every component added by later tasks must import these helpers instead of constructing URLs inline.

- [ ] **Step 4: Run path tests**

Run npm.cmd test -- src/app/paths.test.ts and expect PASS.

- [ ] **Step 5: Write Worker fallback tests**

Test these cases with a mocked ASSETS.fetch:

1. /handbook/javascript-async/event-loop receives asset 404 then index.html 200.
2. /assets/missing.js returns the original 404.
3. /og.png returns the original asset response.

- [ ] **Step 6: Implement and bundle worker/index.ts**

~~~ts
type Env = { ASSETS: { fetch(request: Request): Promise<Response> } };

function looksLikeAsset(pathname: string) {
  return pathname.split('/').pop()?.includes('.') ?? false;
}

export default {
  async fetch(request: Request, env: Env) {
    const response = await env.ASSETS.fetch(request);
    const url = new URL(request.url);
    if (response.status !== 404 || looksLikeAsset(url.pathname)) return response;
    const fallback = new URL('/index.html', url);
    return env.ASSETS.fetch(new Request(fallback, {
      method: 'GET',
      headers: request.headers,
    }));
  },
};
~~~

Replace the string-writing build helper with an esbuild invocation:

~~~js
import { build } from 'esbuild';

await build({
  entryPoints: ['worker/index.ts'],
  outfile: 'dist/server/index.js',
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2022',
});
~~~

- [ ] **Step 7: Run and commit**

~~~powershell
npm.cmd test -- src/app/paths.test.ts worker/index.test.ts
npm.cmd run typecheck
npm.cmd run build
git add src/app/paths.ts src/app/paths.test.ts worker scripts/build-worker.mjs
git commit -m "feat: add shareable routes and spa fallback"
git push origin HEAD
~~~

Expected: all checks PASS and dist/server/index.js exists.

---

### Task 7: Build the Application Shell and Core Pages

**Files:**
- Create: src/app/App.tsx
- Create: src/app/AppShell.tsx
- Create: src/app/router.tsx
- Create: src/app/RouteFocus.tsx
- Create: src/app/RootErrorBoundary.tsx
- Create: src/app/pages/HomePage.tsx
- Create: src/app/pages/HandbookPage.tsx
- Create: src/app/pages/ChapterPage.tsx
- Create: src/app/pages/KnowledgeMapPage.tsx
- Create: src/app/pages/NotFoundPage.tsx
- Create: src/app/AppShell.test.tsx
- Create: src/app/router.test.tsx
- Modify: src/main.tsx

**Interfaces:**
- Consumes: chapters, topics, getChapterTopics, router Outlet and navigation.
- Produces: App, appRouter, createTestRouter(initialEntries), RouteFocus, AppShell and core landing/navigation pages.

- [ ] **Step 1: Write shell behavior tests**

Tests must verify:

- A skip link targets #main-content.
- Desktop navigation contains handbook, knowledge map, interview, code and reference links.
- Clicking the mobile menu sets aria-expanded to true and exposes the chapter links.
- Escape closes the mobile menu and restores focus to the trigger.
- /, /handbook, /handbook/:chapter and /knowledge-map render their expected h1.
- /missing renders “页面没有收录”.
- Route changes update document.title and move focus to the new h1.

- [ ] **Step 2: Run and confirm failure**

Run npm.cmd test -- src/app/AppShell.test.tsx.

Expected: FAIL because AppShell does not exist.

- [ ] **Step 3: Implement AppShell**

Use NavLink for active navigation, Outlet for page content, and one transient mobile-menu state. Do not read or write localStorage. Add the search trigger placeholder now, but SearchDialog is wired in Task 10.

- [ ] **Step 4: Implement core pages**

- HomePage: concise positioning, ten chapter links, three reading paths and eight sample-topic links.
- HandbookPage: all chapters with summary and sample-topic count.
- ChapterPage: validate chapter param, show chapter goals and grouped topic links, otherwise throw a route 404 response.
- KnowledgeMapPage: render all chapters and related-topic edges as accessible lists; no canvas-only information.
- RootErrorBoundary: render “页面加载失败”, error summary, retry and home actions.

router.tsx initially declares /, /handbook, /handbook/:chapter, /knowledge-map and wildcard 404. Export createTestRouter(initialEntries) using the same route object factory. Topic and secondary routes are added only when their final pages exist in Tasks 8 and 10.

RouteFocus watches pathname, updates document.title from the deepest route handle title, then focuses the h1 inside main with preventScroll. If no h1 exists, it focuses main.

- [ ] **Step 5: Add page tests**

Test that ChapterPage displays only topics for the requested chapter and that an unknown chapter reaches NotFoundPage.

- [ ] **Step 6: Run and commit**

~~~powershell
npm.cmd test -- src/app
npm.cmd run typecheck
git add src/app src/main.tsx
git commit -m "feat: build handbook shell and core pages"
git push origin HEAD
~~~

---

### Task 8: Build the Long-Form Topic Reader

**Files:**
- Create: src/components/content/TopicLayout.tsx
- Create: src/components/content/TopicToc.tsx
- Create: src/components/content/ContentCallout.tsx
- Create: src/components/content/CopyCodeButton.tsx
- Create: src/components/content/RelatedTopics.tsx
- Create: src/components/content/TopicLayout.test.tsx
- Create: src/app/pages/TopicPage.tsx
- Create: src/mdx-components.tsx
- Modify: src/app/router.tsx
- Modify: src/app/router.test.tsx

**Interfaces:**
- Consumes: getTopic, loadTopic, getAdjacentTopics, MDXProvider.
- Produces: TopicPage and reusable MDX content components.

- [ ] **Step 1: Write failing reader tests**

Tests must verify:

- Topic metadata and MDX body render together.
- Unknown topic displays the 404 page.
- Related and adjacent links use real route URLs.
- The TOC contains all h2 elements and updates aria-current after an IntersectionObserver event.
- CopyCodeButton copies code and announces “已复制”.
- Clipboard failure shows “请手动复制代码”.

- [ ] **Step 2: Run and confirm failure**

Run npm.cmd test -- src/components/content/TopicLayout.test.tsx.

Expected: FAIL because reader components do not exist.

- [ ] **Step 3: Implement TopicPage loading**

Use React.lazy with a loader created from the topic slug. Wrap it in Suspense with a text skeleton that preserves the article width. Catch load rejection in the route error boundary and include the requested topic title in the error message.

Add /handbook/:chapter/:topic to the shared route factory. The route test must directly open /handbook/javascript-async/event-loop, render the article h1, reload through a new memory router at the same URL, and verify the same h1 again.

- [ ] **Step 4: Implement the reader layout**

TopicLayout renders:

- Breadcrumb and metadata.
- One-sentence conclusion callout.
- MDX body inside an article element.
- Sticky TopicToc on desktop.
- Sources from metadata.
- Related and adjacent topics.

TopicToc queries h2 and h3 after the article mounts and uses IntersectionObserver with rootMargin '-20% 0px -65%' to set aria-current.

- [ ] **Step 5: Implement MDX components and code copying**

Map a, table, blockquote, pre, ContentCallout and CopyCodeButton through MDXProvider. External links receive rel="noreferrer" and an accessible external-link suffix. Internal links use React Router Link.

- [ ] **Step 6: Run and commit**

~~~powershell
npm.cmd test -- src/components/content src/app/pages/TopicPage.tsx
npm.cmd run typecheck
git add src/components src/app/pages/TopicPage.tsx src/app/router.tsx src/app/router.test.tsx src/mdx-components.tsx
git commit -m "feat: add accessible long-form topic reader"
git push origin HEAD
~~~

---

### Task 9: Add Weighted Search and Keyboard Navigation

**Files:**
- Create: src/features/search/searchIndex.ts
- Create: src/features/search/searchIndex.test.ts
- Create: src/features/search/HighlightText.tsx
- Create: src/features/search/SearchDialog.tsx
- Create: src/features/search/SearchDialog.test.tsx
- Modify: src/app/AppShell.tsx

**Interfaces:**
- Consumes: topics and chapter metadata.
- Produces: createSearchIndex(topics), searchTopics(query), SearchDialog.

- [ ] **Step 1: Write failing search-index tests**

~~~ts
test('ranks title matches above body and summary matches', () => {
  const results = searchTopics('事件循环');
  expect(results[0].item.slug).toBe('event-loop');
});

test('returns an empty result for blank input', () => {
  expect(searchTopics('   ')).toEqual([]);
});
~~~

Configure Fuse weights: title 0.45, keywords 0.25, summary 0.2, searchText 0.1; threshold 0.35.

- [ ] **Step 2: Run and confirm failure**

Run npm.cmd test -- src/features/search/searchIndex.test.ts.

Expected: FAIL because searchIndex.ts does not exist.

- [ ] **Step 3: Implement the index**

Create one lazily initialized Fuse instance. The searchText field is supplied by the content manifest; during phase one it contains the article section summaries defined in metadata modules. Do not import MDX article modules into the initial bundle.

- [ ] **Step 4: Write dialog interaction tests**

Verify:

- Slash opens the dialog unless focus is in an input or textarea.
- ArrowDown and ArrowUp change the active descendant.
- Enter opens the active result.
- Escape closes and restores focus.
- Tab remains inside the dialog.
- The matched query is wrapped in mark elements.

- [ ] **Step 5: Implement SearchDialog**

Use role="dialog", aria-modal, aria-activedescendant and a manually managed focus loop. SearchDialog receives open, onClose and triggerRef props. Results are Links so opening a result changes the URL.

- [ ] **Step 6: Run and commit**

~~~powershell
npm.cmd test -- src/features/search
npm.cmd run typecheck
git add src/features/search src/app/AppShell.tsx
git commit -m "feat: add weighted keyboard search"
git push origin HEAD
~~~

---

### Task 10: Rebuild Interview, Code, and Reference Pages Without Persistence

**Files:**
- Create: src/features/interview/questionBank.ts
- Create: src/features/interview/InterviewDeck.tsx
- Create: src/features/interview/InterviewDeck.test.tsx
- Create: src/app/pages/InterviewPage.tsx
- Create: src/app/pages/CodePage.tsx
- Create: src/app/pages/ReferencePage.tsx
- Create: src/app/pages/secondary-pages.test.tsx
- Modify: src/app/router.tsx
- Modify: src/app/router.test.tsx

**Interfaces:**
- Consumes: TopicMeta, routes and eight sample topics.
- Produces: deriveQuestions(topics), InterviewDeck transient state and three route pages.

- [ ] **Step 1: Write failing interview tests**

Verify filtering by chapter and level, deterministic random selection with an injected random function, timer countdown using fake timers, answer reveal, and timer reset when moving to the next question.

~~~ts
const next = selectRandomQuestion(questions, () => 0.5, current.slug);
expect(next.slug).not.toBe(current.slug);
~~~

- [ ] **Step 2: Run and confirm failure**

Run npm.cmd test -- src/features/interview.

Expected: FAIL because the feature does not exist.

- [ ] **Step 3: Implement the transient interview deck**

Derive one question per sample topic using its title and TopicMeta.interview fields. Store current question, remaining seconds and revealed state only in component state. Confirm no Storage API appears in the feature.

- [ ] **Step 4: Build CodePage and ReferencePage**

- CodePage lists topics whose TopicMeta.hasCode is true, explains expected input/output and links to the full article. It does not execute arbitrary code.
- ReferencePage provides HTTP cache directives, browser rendering stages, TypeScript narrowing tools, React state choices and testing-level selection tables. Every table entry links to a sample topic.

Add /interview, /code and /reference to the shared route factory with lazy page modules. Extend router tests to open each URL directly and verify its unique h1.

- [ ] **Step 5: Add secondary-page tests**

Verify each page has one h1, links point to real topic routes, tables have captions and mobile filtering controls have accessible names.

- [ ] **Step 6: Run and commit**

~~~powershell
npm.cmd test -- src/features/interview src/app/pages/secondary-pages.test.tsx
npm.cmd run typecheck
git add src/features/interview src/app/pages src/app/router.tsx src/app/router.test.tsx
git commit -m "feat: rebuild interview code and reference pages"
git push origin HEAD
~~~

---

### Task 11: Apply the V2 Reading Design and Local Fonts

**Files:**
- Create: src/styles/tokens.css
- Create: src/styles/base.css
- Create: src/styles/layout.css
- Create: src/styles/content.css
- Create: src/styles/components.css
- Modify: src/main.tsx
- Modify: index.html
- Create: src/styles/style-contract.test.ts

**Interfaces:**
- Consumes: Fontsource packages and all phase-one components.
- Produces: stable design tokens and responsive layouts.

- [ ] **Step 1: Write style contract tests**

Read CSS files as raw text and assert:

- tokens.css defines --color-paper, --color-ink, --color-accent, --content-width and --focus-ring.
- base.css contains prefers-reduced-motion and focus-visible.
- layout.css contains 1120px, 780px and 500px breakpoints.
- index.html contains no fonts.googleapis.com or fonts.gstatic.com.

- [ ] **Step 2: Run and confirm failure**

Run npm.cmd test -- src/styles/style-contract.test.ts.

Expected: FAIL because the V2 style files do not exist and index.html still references Google Fonts.

- [ ] **Step 3: Add local font imports**

At the top of main.tsx import:

~~~ts
import '@fontsource-variable/noto-sans-sc';
import '@fontsource/dm-mono/400.css';
import '@fontsource/dm-mono/500.css';
~~~

Remove all Google Fonts preconnect and stylesheet references from index.html and old CSS.

- [ ] **Step 4: Implement tokens and base styles**

Use:

~~~css
:root {
  --color-paper: #f3f0e7;
  --color-surface: #fbfaf5;
  --color-ink: #171914;
  --color-muted: #6e7068;
  --color-line: #d7d4c9;
  --color-accent: #b8f34a;
  --content-width: 760px;
  --focus-ring: 3px solid #76a91e;
  --font-body: 'Noto Sans SC Variable', system-ui, sans-serif;
  --font-mono: 'DM Mono', ui-monospace, monospace;
}
~~~

Dark theme can remain a transient component state but must not write storage.

- [ ] **Step 5: Implement layouts**

- Desktop: 260px chapter navigation, minmax(0, 760px) article, 180px TOC.
- Tablet: chapter navigation becomes an overlay drawer; article remains centered.
- Mobile: single column, 16px outer padding, no clipped code, minimum 44px controls.
- At 200% zoom, navigation remains operable and body text does not require horizontal scrolling.

- [ ] **Step 6: Run and commit**

~~~powershell
npm.cmd test -- src/styles/style-contract.test.ts
npm.cmd run lint
npm.cmd run typecheck
git add src/styles src/main.tsx index.html
git commit -m "style: apply v2 editorial reading system"
git push origin HEAD
~~~

---

### Task 12: Add Content Checks to the Build and End-to-End Tests

**Files:**
- Create: src/content/content-contract.test.ts
- Create: playwright.config.ts
- Create: tests/e2e/handbook.spec.ts
- Modify: package.json
- Modify: package-lock.json

**Interfaces:**
- Consumes: complete phase-one application.
- Produces: enforced content contract and browser smoke suite.

- [ ] **Step 1: Write the full content contract test**

The test must assert:

- Exactly eight phase-one topics.
- Every metadata source uses HTTPS.
- Every prerequisite and related slug exists.
- Every article module imports successfully.
- Rendered article text contains headings matching 一句话结论, 核心机制, 项目应用, 边界与反例, 面试回答, 深度追问 and 资料来源.

- [ ] **Step 2: Run and fix only contract failures**

Run npm.cmd run test:content.

Expected: PASS after correcting any missing article sections; do not weaken assertions.

- [ ] **Step 3: Configure Playwright**

Use one Chromium project, baseURL http://127.0.0.1:4173, and webServer command npm.cmd run preview -- --host 127.0.0.1. Reuse the server outside CI.

- [ ] **Step 4: Write desktop and mobile smoke tests**

tests/e2e/handbook.spec.ts must verify:

- Homepage → handbook → JavaScript async chapter → event loop.
- Direct event-loop URL reload remains on the article.
- Back and forward preserve the correct headings.
- Slash opens search; typing 缓存 and Enter opens HTTP cache.
- Interview timer starts at 90 and answer reveal works.
- A 390×844 viewport opens and closes the chapter drawer.
- Unknown route renders 页面没有收录.

- [ ] **Step 5: Run browser tests**

Run:

~~~powershell
npx.cmd playwright install chromium
npm.cmd run test:e2e
~~~

Expected: all tests PASS on desktop and configured mobile viewport.

- [ ] **Step 6: Enforce checks in scripts**

Set:

~~~json
"check": "npm run lint && npm run typecheck && npm run test && npm run build",
"build": "npm run test:content && tsc -b && vite build && node scripts/build-worker.mjs"
~~~

- [ ] **Step 7: Commit**

~~~powershell
git add package.json package-lock.json playwright.config.ts tests src/content/content-contract.test.ts
git commit -m "test: enforce content and browser contracts"
git push origin HEAD
~~~

---

### Task 13: Remove the MVP Implementation and Verify Phase One

**Files:**
- Delete: src/App.tsx
- Delete: src/App.css
- Delete: src/index.css
- Delete: src/data.ts
- Modify: README.md
- Modify: public/og.png
- Create: scripts/optimize-og.mjs

**Interfaces:**
- Consumes: all V2 modules and checks.
- Produces: clean phase-one source tree and documented contributor workflow.

- [ ] **Step 1: Prove the old modules are unused**

Run:

~~~powershell
rg -n "from './App|from './data|App.css|index.css" src
~~~

Expected: only obsolete files refer to each other. If active V2 files import them, remove those imports before deletion.

- [ ] **Step 2: Delete the obsolete files**

Use apply_patch to delete src/App.tsx, src/App.css, src/index.css and src/data.ts. Do not remove any V2 content file.

- [ ] **Step 3: Update README**

Document:

- Route map.
- Topic directory format with meta.ts and article.mdx.
- Required article sections.
- Commands npm run dev, test, test:content, test:e2e, check and build.
- Explicit statement that the application stores no learning progress.

- [ ] **Step 4: Compress the social image**

Create scripts/optimize-og.mjs and run it. It must produce a 1200×675 WebP without changing visible text:

~~~js
import sharp from 'sharp';

await sharp('public/og.png')
  .resize(1200, 675, { fit: 'cover' })
  .webp({ quality: 82, effort: 6 })
  .toFile('public/og.webp');
~~~

Verify public/og.webp is below 400KB, update index.html to /og.webp, then delete public/og.png with apply_patch. Do not generate a new visual.

- [ ] **Step 5: Run the complete verification**

Run:

~~~powershell
npm.cmd run check
npm.cmd run test:e2e
~~~

Expected:

- ESLint PASS.
- TypeScript PASS.
- Unit and content tests PASS.
- Production build PASS.
- Playwright PASS.

- [ ] **Step 6: Check performance and forbidden behavior**

Run:

~~~powershell
$jsBytes = (Get-ChildItem dist\assets\*.js | Measure-Object Length -Sum).Sum
Write-Output $jsBytes
Get-Item public\og.* | Select-Object Name,Length
rg -n "localStorage|sessionStorage|indexedDB|document.cookie|fonts.googleapis" src index.html
~~~

Expected:

- Initial route JavaScript gzip report from Vite is below 100KB.
- Social image is below 409600 bytes.
- The forbidden-behavior search returns no matches.

- [ ] **Step 7: Review working tree and commit**

~~~powershell
git diff --check
git status --short
git add README.md index.html public scripts/optimize-og.mjs src
git commit -m "feat: complete handbook v2 foundation"
git push origin HEAD
~~~

- [ ] **Step 8: Prepare phase-one handoff**

Record in the completion message:

- Eight sample topic URLs.
- Validation commands and outcomes.
- Initial JavaScript gzip size.
- Social image size.
- Any remaining phase-two content work, without describing it as a phase-one defect.

---

### Task 14: Publish the Validated Phase-One Site and Record the Release

**Files:**
- Create: docs/releases/2026-08-12-v2-phase1.md
- Modify: README.md

**Interfaces:**
- Consumes: the exact pushed branch-head commit, dist/server/index.js, dist assets and .openai/hosting.json.
- Produces: a private Sites deployment URL and a release record committed to GitHub.

- [ ] **Step 1: Confirm the source state is exact and remote-backed**

Run:

~~~powershell
git status --porcelain
git rev-parse HEAD
git ls-remote origin agent/frontend-handbook-v2-phase1
~~~

Expected: working tree is empty and the remote branch SHA equals HEAD.

- [ ] **Step 2: Obtain explicit source-export approval**

Ask the user to approve exporting the validated repository source to the private Sites source repository. Do not push to the Sites repository without that explicit approval. If approval is denied, leave the GitHub branch intact and report publishing as the only remaining gated action.

- [ ] **Step 3: Save and deploy the exact validated version**

After approval:

1. Read project_id from .openai/hosting.json.
2. Request a fresh source repository write credential for that project.
3. Push HEAD with a per-command HTTP authorization header; never persist the credential in a remote URL or Git configuration.
4. Package the site with the installed sites-hosting package-site.sh helper into a temporary archive.
5. Save one Sites version using the pushed HEAD SHA and archive.
6. Deploy with owner-only private access when available.
7. Poll the deployment until succeeded or failed.

Expected: deployment status is succeeded and returns a production URL.

- [ ] **Step 4: Write the release record**

docs/releases/2026-08-12-v2-phase1.md must contain the deployment URL, Git commit SHA, eight topic URLs, validation commands, initial JavaScript gzip size and social image size. Add the deployment URL to README.md under “在线访问”.

- [ ] **Step 5: Commit and push the release record**

~~~powershell
git add README.md docs/releases/2026-08-12-v2-phase1.md
git commit -m "docs: record handbook v2 phase-one release"
git push origin HEAD
~~~

Expected: the release record is available on the remote feature branch. Do not redeploy for documentation-only changes.

---

## Plan Self-Review Checklist

- [x] Every phase-one requirement in the approved design maps to a task.
- [x] No task contains unresolved placeholder markers or an undefined interface.
- [x] TopicMeta, TopicModule, registry and route names are consistent across tasks.
- [x] No task introduces persistent learning state.
- [x] Worker routing distinguishes client routes from missing static assets.
- [x] The final verification includes content, unit, browser, lint, type and production checks.
