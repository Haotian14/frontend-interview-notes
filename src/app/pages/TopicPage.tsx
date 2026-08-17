import { lazy, Suspense, useMemo } from 'react';
import { MDXProvider } from '@mdx-js/react';
import { useParams } from 'react-router-dom';
import TopicLayout from '../../components/content/TopicLayout';
import { getTopic, loadTopic } from '../../content/registry';
import { mdxComponents } from '../../mdx-components';

export default function TopicPage() {
  const { chapter, topic: topicSlug } = useParams();
  const topic = topicSlug ? getTopic(topicSlug) : undefined;

  if (!topic || topic.chapter !== chapter) {
    throw new Response('Unknown handbook topic', {
      status: 404,
      statusText: 'Not Found',
    });
  }

  const Article = useMemo(() => lazy(async () => {
    try {
      return await loadTopic(topic.slug);
    } catch (error) {
      throw new Error(`无法加载专题「${topic.title}」`, { cause: error });
    }
  }), [topic.slug, topic.title]);

  return (
    <Suspense
      fallback={(
        <div className="topic-loading" role="status">
          <p>正在加载「{topic.title}」…</p>
        </div>
      )}
    >
      <TopicLayout topic={topic}>
        <MDXProvider components={mdxComponents}>
          <Article />
        </MDXProvider>
      </TopicLayout>
    </Suspense>
  );
}
