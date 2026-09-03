import { lazy, Suspense } from 'react';
import { loadAllPractices, topics } from '../../content/registry';

/*
  题库正文、追问索引和 InterviewDeck 组件一起惰性加载。

  面试答案是全站最大的一块文本，只有这里和专题页需要；而路由表静态导入所有
  页面（见 routes.tsx），组件模块只要写在顶层 import 里就会进首屏包，所以
  连 InterviewDeck 本身也从这个边界里取。预渲染用 renderToPipeableStream
  等待所有 Suspense 边界，静态 HTML 里仍有完整题库。
*/
const InterviewDeckLoader = lazy(async () => {
  const [{ default: InterviewDeck }, { deriveQuestions, loadFollowUpIndex }] = await Promise.all([
    import('../../features/interview/InterviewDeck'),
    import('../../features/interview/questionBank'),
  ]);

  const [practices, followUps] = await Promise.all([
    loadAllPractices(),
    loadFollowUpIndex(),
  ]);

  const questions = deriveQuestions(topics, practices, followUps);
  return { default: () => <InterviewDeck questions={questions} /> };
});

export default function InterviewPage() {
  return (
    <div className="interview-page">
      <header className="page-header">
        <p className="page-eyebrow">INTERVIEW / TRANSIENT PRACTICE</p>
        <h1 tabIndex={-1}>面试训练场</h1>
        <p className="page-lead">先独立组织答案，再展开参考结构；筛选和计时保留在本次页面会话中，掌握度记录在本机。</p>
      </header>
      <Suspense fallback={<p role="status">正在加载题库…</p>}>
        <InterviewDeckLoader />
      </Suspense>
    </div>
  );
}
