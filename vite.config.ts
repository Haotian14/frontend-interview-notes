import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypePrettyCode from 'rehype-pretty-code';
import { configDefaults } from 'vitest/config';
// @ts-expect-error 构建脚本是 .mjs，没有类型声明。
import { writeSearchIndex } from './scripts/build-search-index.mjs';

/**
 * 正文检索索引由 article.mdx 生成。放进 buildStart 而不是单独的 npm 脚本，
 * 是为了让 dev、test 和 build 三条路径拿到的索引永远和当前正文一致。
 */
function searchIndexPlugin(): Plugin {
  return {
    name: 'handbook-search-index',
    buildStart() {
      writeSearchIndex();
    },
    configureServer(server) {
      server.watcher.on('change', file => {
        if (file.endsWith('article.mdx')) writeSearchIndex();
      });
    },
  };
}

export default defineConfig({
  plugins: [
    searchIndexPlugin(),
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
  },
});
