# 前端复习手册 V2

一个基于 React、TypeScript、Vite 与 MDX 的前端知识手册。10 个知识章节均已有内容，共 42 篇统一质量标准的专题，配合正文全文检索、面试训练、代码索引、速查表和本地阅读进度。

站点在构建期完成预渲染：每条路由都产出带完整正文的静态 HTML，因此首屏文字不依赖 JavaScript，搜索引擎也能直接抓取内容。

## 路由

| 地址 | 内容 |
| --- | --- |
| `/` | 手册首页与三条复习路径 |
| `/handbook` | 完整章节目录 |
| `/handbook/:chapter` | 章节页 |
| `/handbook/:chapter/:topic` | 稳定、可直接刷新的专题页 |
| `/knowledge-map` | 章节与专题关系 |
| `/interview` | 90 秒面试训练 |
| `/code` | 含代码样板专题索引 |
| `/reference` | 五类前端速查表 |

## 专题目录

每篇专题位于：

```text
src/content/topics/<chapter>/<slug>/
├── meta.ts       # 列表页就要用到的轻量元数据，随首屏一起加载
├── practice.ts   # 面试答案、速查表、代码条目，按需加载
└── article.mdx   # 正文，按需加载
```

`meta.ts` 提供标题、摘要、层级、阅读时间、关键词、前置/关联专题、HTTPS 资料、搜索文本，以及 `hasCode` 标记。它对全站的目录、章节页、知识地图和搜索都是必需的，因此随首屏加载。

`practice.ts` 提供三样只服务特定页面的长文本：`interview`（专题页顶部的结论卡片与 `/interview` 的参考答案）、可选的 `reference`（`/reference` 上的一张速查表）、以及 `hasCode` 为真时必填的 `code`（预期输入与可观察输出，驱动 `/code`）。这部分按专题各成一个惰性分片——它是全站文本量最大的部分，放进 `meta.ts` 会让每个访客都下载全部专题的答案。

注册表会在构建与测试时校验两边的关系完整性：`validateContent` 检查 `meta.ts`，`validatePractices` 检查 `practice.ts` 与之的对应关系。

`summary` 与 `interview` 字段按纯文本渲染，写入 Markdown 语法会被内容校验拒绝。

正文内的站内互链统一写成 `/topics/<slug>`，与章节归属解耦；渲染时解析为真实路由 `/handbook/<chapter>/<topic>`，指向不存在的 slug 会让内容合同测试失败。

`article.mdx` 必须包含以下二级章节：

- 一句话结论
- 前置知识
- 核心机制
- 项目应用
- 边界与反例
- 面试回答
- 深度追问
- 关联专题
- 资料来源

验证材料可以采用最小代码、浏览器步骤、表格或可复现观察。

## 常用命令

```bash
npm run dev
npm run test
npm run test:content
npm run test:e2e
npm run check
npm run build
```

- `test`：运行 Vitest 单元、组件和内容测试。
- `test:content`：只运行内容合同。
- `test:e2e`：以 Playwright Chromium 验证生产预览。
- `check`：依次执行 lint、类型检查、全部测试和生产构建。
- `build`：验证内容 → 构建客户端 → 构建 SSR 包 → 预渲染全部路由并生成 sitemap/robots/404 → 构建 Sites Worker → 校验产物。

## 检索

搜索同时覆盖两层：`meta.ts` 的标题与关键词，以及由 `scripts/build-search-index.mjs` 从 `article.mdx` 正文生成的小节索引。命中正文时结果会显示所在小节与摘录，并直接深链到该标题的锚点。

索引在 dev、test 和 build 三条路径上都由 Vite 插件自动重建，产物写入 `src/generated/`（不入版本库），因此不会与正文脱节。

## 数据与隐私

应用不创建账户，不使用 Cookie，也不加载第三方域上的任何资源；构建校验会拒绝 `document.cookie` 和外部字体域。

唯一写入浏览器的是阅读进度（哪些专题被标记为读完），只存在本机 `localStorage`，不参与任何网络请求，可以在目录页一键清除。它被限制在 `src/features/progress/progressStore.ts` 这一个模块内，其它文件直接访问 `localStorage` 会导致构建失败。

筛选、计时、答案展开和当前题目仍然只存在于组件内存中。

## 现有专题

| 章节 | 专题 |
| --- | --- |
| 01 HTML、语义化与可访问性 | `/handbook/html-a11y/semantic-accessibility` 语义化 HTML 与可访问性<br />`/handbook/html-a11y/form-validation` 表单控件与原生校验<br />`/handbook/html-a11y/responsive-images` 响应式图片与媒体加载 |
| 02 CSS 布局、渲染与工程化 | `/handbook/css/stacking-context` 层叠上下文与 z-index<br />`/handbook/css/cascade-specificity` 层叠、优先级与继承<br />`/handbook/css/flex-grid-layout` Flexbox 与 Grid 布局模型<br />`/handbook/css/bfc-margin-collapse` BFC 与外边距折叠 |
| 03 JavaScript 语言核心 | `/handbook/javascript-core/closures-scope` 作用域链与闭包<br />`/handbook/javascript-core/this-binding` this 绑定与调用点<br />`/handbook/javascript-core/prototype-inheritance` 原型链与继承<br />`/handbook/javascript-core/type-coercion` 类型转换与相等比较<br />`/handbook/javascript-core/module-systems` 模块系统与 ESM |
| 04 JavaScript 异步与 Web API | `/handbook/javascript-async/event-loop` 事件循环与任务队列<br />`/handbook/javascript-async/promise-semantics` Promise 状态机与组合<br />`/handbook/javascript-async/async-await-errors` async/await 与错误处理<br />`/handbook/javascript-async/abort-race` 请求取消与竞态 |
| 05 TypeScript 类型系统 | `/handbook/typescript/type-narrowing` 类型收窄与穷尽检查<br />`/handbook/typescript/generics-constraints` 泛型与约束<br />`/handbook/typescript/conditional-mapped-types` 条件类型与映射类型<br />`/handbook/typescript/structural-variance` 结构化类型与型变 |
| 06 React 原理与应用架构 | `/handbook/react/render-state-snapshot` React 渲染与状态快照<br />`/handbook/react/hooks-dependencies` Hooks 规则与依赖数组<br />`/handbook/react/reconciliation-keys` 协调算法与 key<br />`/handbook/react/react-performance` React 性能优化<br />`/handbook/react/state-architecture` 状态归属与 Context 边界 |
| 07 浏览器与网络 | `/handbook/browser-network/rendering-pipeline` 浏览器渲染流水线<br />`/handbook/browser-network/http-cache` HTTP 缓存与重新验证<br />`/handbook/browser-network/cors-cross-origin` 同源策略与 CORS<br />`/handbook/browser-network/web-storage-cookies` 浏览器存储与 Cookie<br />`/handbook/browser-network/http-versions` HTTP 版本演进与连接 |
| 08 性能、安全与稳定性 | `/handbook/quality/xss-defense` XSS 防御与内容安全策略<br />`/handbook/quality/web-vitals` Core Web Vitals 与性能测量<br />`/handbook/quality/csrf-defense` CSRF 与身份凭证<br />`/handbook/quality/error-monitoring` 前端错误监控与稳定性 |
| 09 构建、测试与工程体系 | `/handbook/engineering/testing-strategy` 前端测试策略与分层<br />`/handbook/engineering/bundling-tree-shaking` 打包、Tree Shaking 与产物<br />`/handbook/engineering/code-splitting` 代码分割与按需加载<br />`/handbook/engineering/ci-quality-gates` CI 质量闸门与发布 |
| 10 手写题、项目设计与面试表达 | `/handbook/interview/debounce-throttle` 防抖与节流的实现与取舍<br />`/handbook/interview/handwritten-promise` 手写 Promise<br />`/handbook/interview/deep-clone` 深拷贝的实现与边界<br />`/handbook/interview/frontend-system-design` 前端系统设计的表达框架 |

内容合同要求每个章节至少有一篇专题；新增专题只需按上面的目录结构添加 `meta.ts`、`practice.ts` 与 `article.mdx`，并同步 `src/content/catalog.ts`，不需要改动路由和阅读器基础设施。
