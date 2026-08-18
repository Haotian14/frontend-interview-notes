import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import '@fontsource-variable/noto-sans-sc';
import '@fontsource/dm-mono/400.css';
import '@fontsource/dm-mono/500.css';
import App from './app/App';
import './styles/tokens.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/content.css';
import './styles/components.css';

const container = document.getElementById('root')!;

const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// 生产构建经过预渲染，容器里已有服务端产出的标记，直接 hydrate；
// dev 下 index.html 的 #root 是空的，仍走客户端渲染。
if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
