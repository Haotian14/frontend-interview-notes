import { isValidElement } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import ContentCallout from './components/content/ContentCallout';
import CopyCodeButton from './components/content/CopyCodeButton';
import { topicPath } from './app/paths';
import { getTopic } from './content/registry';

function textContent(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textContent).join('');
  if (isValidElement<{ children?: ReactNode }>(node)) return textContent(node.props.children);
  return '';
}

/**
 * 正文里的站内互链统一写成 `/topics/<slug>`，与章节归属解耦：专题换章节时不必
 * 改写所有引用它的文章。真实路由是 /handbook/:chapter/:topic，在这里解析。
 */
const TOPIC_LINK = /^\/topics\/([^/#?]+)(#.*)?$/;

export function resolveContentHref(href: string) {
  const match = TOPIC_LINK.exec(href);
  if (!match) return href;

  const topic = getTopic(match[1]);
  if (!topic) return undefined;
  return topicPath(topic) + (match[2] ?? '');
}

function MdxAnchor({
  href,
  children,
  ...props
}: ComponentPropsWithoutRef<'a'>) {
  const destination = href ?? '#';
  const isExternal = /^https?:\/\//.test(destination);

  if (isExternal) {
    return (
      <a {...props} href={destination} rel="noreferrer">
        {children}
        <span className="external-link-suffix">
          <span aria-hidden="true"> ↗</span>
          <span className="visually-hidden">（外部链接）</span>
        </span>
      </a>
    );
  }

  const resolved = resolveContentHref(destination);

  // 指向不存在的专题：内容合同测试会让它在 CI 失败，运行时降级为普通文本而不是死链。
  if (resolved === undefined) {
    return <span className="broken-topic-link" title="该专题尚未收录">{children}</span>;
  }

  return <Link to={resolved}>{children}</Link>;
}

/*
  正文的 h1 和页面标题是同一句话。以前把它降级成一行小字渲染在结论卡片下面，
  屏幕上就多出一个没有归属的重复标题；这里直接丢弃，标题只由 TopicLayout 出。
*/
function MdxDocumentTitle() {
  return null;
}

function MdxPre({
  children,
  ...props
}: ComponentPropsWithoutRef<'pre'>) {
  const code = textContent(children).replace(/\n$/, '');

  return (
    <div className="mdx-code-block">
      <div className="mdx-code-block__toolbar">
        <span>CODE</span>
        <CopyCodeButton code={code} />
      </div>
      <pre {...props}>{children}</pre>
    </div>
  );
}

function MdxTable(props: ComponentPropsWithoutRef<'table'>) {
  return <div className="table-scroll"><table {...props} /></div>;
}

function MdxBlockquote(props: ComponentPropsWithoutRef<'blockquote'>) {
  return <blockquote className="content-quote" {...props} />;
}

export const mdxComponents = {
  h1: MdxDocumentTitle,
  a: MdxAnchor,
  pre: MdxPre,
  table: MdxTable,
  blockquote: MdxBlockquote,
  ContentCallout,
  CopyCodeButton,
};
