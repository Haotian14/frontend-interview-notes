import InterviewDeck from '../../features/interview/InterviewDeck';
import { deriveQuestions } from '../../features/interview/questionBank';
import { topics } from '../../content/registry';

const questions = deriveQuestions(topics);

export default function InterviewPage() {
  return (
    <div className="interview-page">
      <header>
        <p>INTERVIEW / TRANSIENT PRACTICE</p>
        <h1 tabIndex={-1}>面试训练场</h1>
        <p>先独立组织答案，再展开参考结构；筛选、计时和当前题目都只保留在本次页面会话中。</p>
      </header>
      <InterviewDeck questions={questions} />
    </div>
  );
}
