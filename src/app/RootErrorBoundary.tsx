import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom';
import NotFoundPage from './pages/NotFoundPage';

export default function RootErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <main id="main-content" tabIndex={-1}>
        <NotFoundPage />
      </main>
    );
  }

  const summary = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : '发生了未知错误。';

  return (
    <main id="main-content" tabIndex={-1}>
      <section aria-labelledby="error-title">
        <p>ERROR / RECOVERY</p>
        <h1 id="error-title">页面加载失败</h1>
        <p>{summary}</p>
        <div>
          <button type="button" onClick={() => window.location.reload()}>重试</button>
          <Link to="/">返回首页</Link>
        </div>
      </section>
    </main>
  );
}
