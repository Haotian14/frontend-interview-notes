# 前端复习手册 V2

一个基于 React、TypeScript、Vite 与 MDX 的前端知识手册。第一阶段提供 10 个知识章节、8 篇统一质量标准的样板专题、加权搜索、面试训练、代码索引和速查表。

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
├── meta.ts
└── article.mdx
```

`meta.ts` 提供标题、摘要、层级、阅读时间、关键词、前置/关联专题、HTTPS 资料、搜索文本和面试答案。注册表会在构建与测试时校验关系完整性。

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
- `build`：先验证内容，再构建客户端与 Sites Worker，并检查首屏 JS、社交图片和禁止行为。

## 数据与隐私

应用不创建账户，也不保存学习进度。筛选、计时、答案展开和当前题目只存在于 React 组件内存中；不会写入浏览器持久化存储或 Cookie。

## 第一阶段样板专题

- `/handbook/html-a11y/semantic-accessibility`
- `/handbook/css/stacking-context`
- `/handbook/javascript-async/event-loop`
- `/handbook/typescript/type-narrowing`
- `/handbook/react/render-state-snapshot`
- `/handbook/browser-network/rendering-pipeline`
- `/handbook/browser-network/http-cache`
- `/handbook/engineering/testing-strategy`

后续阶段可以在相同内容合同下继续扩充其余章节，不需要改动路由和阅读器基础设施。
