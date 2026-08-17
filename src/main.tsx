import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/noto-sans-sc';
import '@fontsource/dm-mono/400.css';
import '@fontsource/dm-mono/500.css';
import App from './app/App';
import './styles/tokens.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/content.css';
import './styles/components.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
