import { lazy, Suspense } from 'react';
import { MDXProvider } from '@mdx-js/react';
import { useParams } from 'react-router-dom';
import TopicLayout from '../../components/content/TopicLayout';
import { getTopic, loadTopic, topics } from '../../content/registry';
import { mdxComponents } from '../../mdx-components';

const articleComponents = new Map(topics.map(topic => [
  topic.slug,
  lazy(async () => {
    try {
      return await loadTopic(topic.slug);
    } catch (error) {
      throw new Error(`无法加载专题「${topic.title}」`, { cause: error });
    }
  }),
]));

export default function TopicPage() {
  const { chapter, topic: topicSlug } = useParams();
  const topic = topicSlug ? getTopic(topicSlug) : undefined;
  const Article = topic ? articleComponents.get(topic.slug) : undefined;

  if (!topic || topic.chapter !== chapter || !Article) {
    throw new Response('Unknown handbook topic', {
      status: 404,
      statusText: 'Not Found',
    });
  }

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
