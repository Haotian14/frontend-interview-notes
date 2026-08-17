import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, RouterProvider } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { getAdjacentTopics, getTopic, topics } from '../../content/registry';
import { topicPath } from '../../app/paths';
import { createTestRouter } from '../../app/router';
import CopyCodeButton from './CopyCodeButton';
import TopicLayout from './TopicLayout';

let intersectionCallback: IntersectionObserverCallback;
let observer: IntersectionObserver;

class TestIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin: string;
  readonly thresholds = [0];

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    intersectionCallback = callback;
    this.rootMargin = options?.rootMargin ?? '0px';
    observer = this;
  }

  disconnect() {}
  observe() {}
  takeRecords() { return []; }
  unobserve() {}
}

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', TestIntersectionObserver);
});

function sampleTopic() {
  const topic = topics.find(item => item.related.length > 0) ?? topics[0];
  if (!topic) throw new Error('测试需要至少一个专题');
  return topic;
}

describe('TopicLayout', () => {
  test('renders topic metadata and article content together', () => {
    const topic = sampleTopic();

    render(
      <MemoryRouter>
        <TopicLayout topic={topic}>
          <h2 id="core-mechanism">核心机制</h2>
          <p>这是 MDX 正文验证。</p>
        </TopicLayout>
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { level: 1, name: topic.title })).toBeInTheDocument();
    expect(screen.getByText(`${topic.level} · ${topic.minutes} 分钟`)).toBeInTheDocument();
    expect(screen.getByText('这是 MDX 正文验证。')).toBeInTheDocument();
    expect(screen.getByText(topic.interview.answer)).toBeInTheDocument();
  });

  test('uses real URLs for related and adjacent topics', () => {
    const topic = sampleTopic();
    const related = topic.related.map(getTopic).find(Boolean);
    const adjacent = getAdjacentTopics(topic.slug);
    const neighbor = adjacent.next ?? adjacent.previous;

    render(
      <MemoryRouter>
        <TopicLayout topic={topic}>
          <h2 id="mechanism">核心机制</h2>
        </TopicLayout>
      </MemoryRouter>,
    );

    if (related) {
      const relatedNav = screen.getByRole('navigation', { name: '关联专题' });
      expect(within(relatedNav).getByRole('link', { name: related.title }))
        .toHaveAttribute('href', topicPath(related));
    }

    if (neighbor) {
      const adjacentNav = screen.getByRole('navigation', { name: '相邻专题' });
      expect(within(adjacentNav).getByRole('link', { name: new RegExp(neighbor.title) }))
        .toHaveAttribute('href', topicPath(neighbor));
    }
  });

  test('builds a heading table of contents and tracks intersections', async () => {
    const topic = sampleTopic();

    render(
      <MemoryRouter>
        <TopicLayout topic={topic}>
          <h2 id="core-mechanism">核心机制</h2>
          <h3 id="render-timing">渲染时机</h3>
        </TopicLayout>
      </MemoryRouter>,
    );

    const toc = await screen.findByRole('navigation', { name: '本页目录' });
    expect(within(toc).getByRole('link', { name: '核心机制' })).toHaveAttribute('href', '#core-mechanism');
    const nestedLink = within(toc).getByRole('link', { name: '渲染时机' });
    expect(nestedLink).toHaveAttribute('href', '#render-timing');

    const heading = screen.getByRole('heading', { level: 3, name: '渲染时机' });
    act(() => {
      intersectionCallback([
        { target: heading, isIntersecting: true } as unknown as IntersectionObserverEntry,
      ], observer);
    });

    expect(nestedLink).toHaveAttribute('aria-current', 'location');
    expect(observer.rootMargin).toBe('-20% 0px -65%');
  });

  test('copies code and announces success', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    render(<CopyCodeButton code="const answer = 42;" />);
    await user.click(screen.getByRole('button', { name: '复制代码' }));

    expect(writeText).toHaveBeenCalledWith('const answer = 42;');
    expect(screen.getByText('已复制')).toHaveAttribute('aria-live', 'polite');
  });

  test('explains how to recover when clipboard access fails', async () => {
    const user = userEvent.setup();
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
    });

    render(<CopyCodeButton code="const answer = 42;" />);
    await user.click(screen.getByRole('button', { name: '复制代码' }));

    expect(screen.getByText('请手动复制代码')).toHaveAttribute('aria-live', 'polite');
  });

  test('unknown topics render the not-found page', async () => {
    render(
      <RouterProvider
        router={createTestRouter(['/handbook/javascript-async/not-a-topic'])}
      />,
    );

    expect(await screen.findByRole('heading', { name: '页面没有收录' })).toBeInTheDocument();
  });
});
