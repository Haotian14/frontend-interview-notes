import { render, screen, within } from '@testing-library/react';
import { RouterProvider } from 'react-router-dom';
import { describe, expect, test } from 'vitest';
import { chapters } from '../../content/chapters';
import { loadAllPractices, topics } from '../../content/registry';
import { topicPath } from '../paths';
import { createTestRouter } from '../router';

function renderRoute(path: string) {
  const router = createTestRouter([path]);
  const view = render(<RouterProvider router={router} />);
  return view;
}

describe('secondary pages', () => {
  test.each([
    ['/interview', '面试训练场'],
    ['/code', '代码手册'],
    ['/reference', '前端速查表'],
  ])('%s has one unique page heading', async (path, heading) => {
    const view = renderRoute(path);
    expect(await screen.findByRole('heading', { level: 1, name: heading }))
      .toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    view.unmount();
  });

  test('code examples link to their real topic routes', async () => {
    const topic = topics.find(item => item.hasCode);
    if (!topic) throw new Error('测试需要代码专题');
    const view = renderRoute('/code');

    const link = await screen.findByRole('link', { name: new RegExp(topic.title) });
    expect(link).toHaveAttribute('href', topicPath(topic));
    view.unmount();
  });

  test('code entries show each topic的真实输入输出与中文章节名', async () => {
    const withCode = (await loadAllPractices()).filter(practice => practice.code);
    expect(withCode.length).toBeGreaterThan(0);

    const topic = topics.find(item => item.slug === withCode[0].slug)!;
    const chapterTitle = chapters.find(item => item.id === topic.chapter)?.title;
    const view = renderRoute('/code');
    await screen.findByRole('heading', { level: 1, name: '代码手册' });
    await screen.findByText(withCode[0].code!.input);

    // 章节显示为中文标题而不是 slug。
    expect(screen.queryByText(new RegExp(topic.chapter))).not.toBeInTheDocument();
    expect(screen.getAllByText(new RegExp(chapterTitle!)).length).toBeGreaterThan(0);

    // 输入输出来自各自专题，不是共用占位文案。
    for (const practice of withCode) {
      expect(screen.getByText(practice.code!.input)).toBeInTheDocument();
      expect(screen.getByText(practice.code!.output)).toBeInTheDocument();
    }
    view.unmount();
  });

  test('reference tables are derived from topic practice files', async () => {
    const withReference = (await loadAllPractices()).filter(practice => practice.reference);
    expect(withReference.length).toBeGreaterThan(0);

    const view = renderRoute('/reference');
    await screen.findByRole('heading', { name: '前端速查表' });
    await screen.findByRole('table', { name: withReference[0].reference!.caption });

    const tables = screen.getAllByRole('table');
    expect(tables).toHaveLength(withReference.length);

    for (const practice of withReference) {
      const topic = topics.find(item => item.slug === practice.slug)!;
      const table = screen.getByRole('table', { name: practice.reference!.caption });
      for (const row of practice.reference!.rows) {
        expect(within(table).getByText(row.term)).toBeInTheDocument();
      }
      // 每张表都标注来源专题并链接过去。
      expect(screen.getByRole('link', { name: topic.title }))
        .toHaveAttribute('href', topicPath(topic));
    }
    view.unmount();
  });

  test('interview filters expose accessible names on mobile and desktop', async () => {
    const view = renderRoute('/interview');
    expect(await screen.findByRole('combobox', { name: '章节筛选' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: '难度筛选' })).toBeInTheDocument();
    view.unmount();
  });
});
