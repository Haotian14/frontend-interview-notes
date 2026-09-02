import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { cloudflare } from '@cloudflare/vite-plugin';
import { sites } from '@openai/sites-vite-plugin';
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypePrettyCode from 'rehype-pretty-code';
import { configDefaults } from 'vitest/config';
// @ts-expect-error 构建脚本是 .mjs，没有类型声明。
import { writeSearchIndex } from './scripts/build-search-index.mjs';
// @ts-expect-error 构建脚本是 .mjs，没有类型声明。
import { writeInterviewIndex } from './scripts/build-interview-index.mjs';

process.env.WRANGLER_WRITE_LOGS ??= 'false';
process.env.WRANGLER_LOG_PATH ??= '.wrangler/logs';
process.env.MINIFLARE_REGISTRY_PATH ??= '.wrangler/registry';

/**
 * 检索索引和追问题库都由 article.mdx 生成。放进 buildStart 而不是单独的
 * npm 脚本，是为了让 dev、test 和 build 三条路径拿到的产物永远和当前正文一致。
 */
function contentIndexPlugin(): Plugin {
  const rebuild = () => {
    writeSearchIndex();
    writeInterviewIndex();
  };

  return {
    name: 'handbook-content-index',
    buildStart() {
      rebuild();
    },
    configureServer(server) {
      server.watcher.on('change', file => {
        if (file.endsWith('article.mdx')) rebuild();
      });
    },
  };
}

export default defineConfig(({ isSsrBuild, mode }) => ({
  plugins: [
    ...(!isSsrBuild && mode !== 'test'
      ? [
          sites(),
          cloudflare({
            viteEnvironment: { name: 'server' },
            config: {
              main: './worker/index.ts',
              compatibility_date: '2026-05-22',
              assets: {
                binding: 'ASSETS',
                html_handling: 'drop-trailing-slash',
                not_found_handling: '404-page',
              },
            },
          }),
        ]
      : []),
    contentIndexPlugin(),
    mdx({
      providerImportSource: '@mdx-js/react',
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        [rehypePrettyCode, { theme: 'github-dark-default' }],
      ],
    }),
    react(),
  ],
  build: {
    rollupOptions: {
      output: {
        // 框架与应用代码分开：框架部分几乎不变，可以长期缓存；
        // 也让构建校验能分别盯住"框架基线"和"应用代码增长"。
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler|react-router)[\\/]/.test(id)) {
            return 'vendor';
          }
          return undefined;
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    globals: true,
    exclude: [...configDefaults.exclude, 'tests/e2e/**'],
    // 内容合同会逐篇渲染全部专题；专题数量增长后 5 秒的默认上限不够用。
    testTimeout: 60_000,
  },
}));
