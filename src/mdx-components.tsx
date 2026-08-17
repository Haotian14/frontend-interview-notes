import { isValidElement } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import ContentCallout from './components/content/ContentCallout';
import CopyCodeButton from './components/content/CopyCodeButton';

function textContent(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textContent).join('');
  if (isValidElement<{ children?: ReactNode }>(node)) return textContent(node.props.children);
  return '';
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

  return <Link to={destination}>{children}</Link>;
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
  a: MdxAnchor,
  pre: MdxPre,
  table: MdxTable,
  blockquote: MdxBlockquote,
  ContentCallout,
  CopyCodeButton,
};
