import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="not-found-page" aria-labelledby="not-found-title">
      <p className="page-eyebrow">404 / NOT FOUND</p>
      <h1 id="not-found-title" tabIndex={-1}>页面没有收录</h1>
      <p className="page-lead">这个地址不存在，或者对应内容还没有进入当前版本。</p>
      <div className="button-row">
        <Link className="button button--primary" to="/">返回首页</Link>
        <Link className="button" to="/handbook">浏览完整目录</Link>
      </div>
    </section>
  );
}
