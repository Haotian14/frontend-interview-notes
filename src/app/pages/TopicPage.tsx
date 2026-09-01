import { createElement, lazy, Suspense } from 'react';
import { MDXProvider } from '@mdx-js/react';
import { useParams } from 'react-router-dom';
import TopicLayout from '../../components/content/TopicLayout';
import { getTopic, loadPractice, loadTopic, topics } from '../../content/registry';
import { mdxComponents } from '../../mdx-components';

/**
 * 正文和面试答案都按专题分片：两者一起加载，落在同一个 Suspense 边界里，
 * 因此读者只会下载自己正在读的这一篇，而不是全部专题的长文本。
 */
const readerComponents = new Map(topics.map(topic => [
  topic.slug,
  lazy(async () => {
    try {
      const [module, practice] = await Promise.all([
        loadTopic(topic.slug),
        loadPractice(topic.slug),
      ]);
      const Article = module.default;

      return {
        default: () => (
          <TopicLayout topic={topic} conclusion={practice.interview.answer}>
            <MDXProvider components={mdxComponents}>
              <Article />
            </MDXProvider>
          </TopicLayout>
        ),
      };
    } catch (error) {
      throw new Error(`无法加载专题「${topic.title}」`, { cause: error });
    }
  }),
]));

export default function TopicPage() {
  const { chapter, topic: topicSlug } = useParams();
  const topic = topicSlug ? getTopic(topicSlug) : undefined;
  const Reader = topic ? readerComponents.get(topic.slug) : undefined;

  if (!topic || topic.chapter !== chapter || !Reader) {
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
      {createElement(Reader)}
    </Suspense>
  );
}
