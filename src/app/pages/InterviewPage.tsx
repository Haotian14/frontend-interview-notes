import { lazy, Suspense } from 'react';
import InterviewDeck from '../../features/interview/InterviewDeck';
import { deriveQuestions } from '../../features/interview/questionBank';
import { loadAllPractices, topics } from '../../content/registry';

// 面试答案是全站最大的一块文本，只有这里和专题页需要，所以按需加载而不是打进首屏包。
// 预渲染用 renderToPipeableStream 等待所有 Suspense 边界，静态 HTML 里仍有完整题库。
const InterviewDeckLoader = lazy(async () => {
  const practices = await loadAllPractices();
  const questions = deriveQuestions(topics, practices);
  return { default: () => <InterviewDeck questions={questions} /> };
});

export default function InterviewPage() {
  return (
    <div className="interview-page">
      <header>
        <p>INTERVIEW / TRANSIENT PRACTICE</p>
        <h1 tabIndex={-1}>面试训练场</h1>
        <p>先独立组织答案，再展开参考结构；筛选、计时和当前题目都只保留在本次页面会话中。</p>
      </header>
      <Suspense fallback={<p role="status">正在加载题库…</p>}>
        <InterviewDeckLoader />
      </Suspense>
    </div>
  );
}
