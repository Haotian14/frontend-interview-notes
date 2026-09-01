import type { Chapter, TopicMeta, TopicPractice, ValidationIssue } from './types';

/** 这些字段按纯文本渲染，写进 Markdown 语法只会原样显示出来。 */
function containsMarkdown(value: string) {
  return /\*\*|\[[^\]]+\]\(/.test(value);
}

export function validateContent(topics: TopicMeta[], chapters: Chapter[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const chapterIds = new Set(chapters.map(chapter => chapter.id));
  const slugs = new Set(topics.map(topic => topic.slug));
  const counts = new Map<string, number>();
  const orderCounts = new Map<string, number>();

  for (const topic of topics) {
    counts.set(topic.slug, (counts.get(topic.slug) ?? 0) + 1);
    const orderKey = topic.chapter + ':' + topic.order;
    orderCounts.set(orderKey, (orderCounts.get(orderKey) ?? 0) + 1);
  }

  for (const topic of topics) {
    if ((counts.get(topic.slug) ?? 0) > 1) {
      issues.push({ topic: topic.slug, message: '重复专题 slug：' + topic.slug });
    }
    const orderKey = topic.chapter + ':' + topic.order;
    if ((orderCounts.get(orderKey) ?? 0) > 1) {
      issues.push({ topic: topic.slug, message: '章节内顺序重复：' + orderKey });
    }
    if (!chapterIds.has(topic.chapter)) {
      issues.push({ topic: topic.slug, message: '未知章节：' + topic.chapter });
    }
    for (const slug of topic.prerequisites) {
      if (!slugs.has(slug)) issues.push({ topic: topic.slug, message: '无效前置专题：' + slug });
    }
    for (const slug of topic.related) {
      if (!slugs.has(slug)) issues.push({ topic: topic.slug, message: '无效关联专题：' + slug });
    }
    if (!topic.sources.length) {
      issues.push({ topic: topic.slug, message: '专题 ' + topic.slug + ' 缺少资料来源' });
    }
    if (!topic.keywords.length) issues.push({ topic: topic.slug, message: '专题缺少关键词：' + topic.slug });
    if (topic.minutes < 1) issues.push({ topic: topic.slug, message: '阅读时间无效：' + topic.slug });
    if (!topic.searchText.trim()) issues.push({ topic: topic.slug, message: '专题缺少搜索文本：' + topic.slug });
    // summary 会被当作纯文本渲染，写进 Markdown 语法只会原样显示出来。
    if (containsMarkdown(topic.summary)) {
      issues.push({
        topic: topic.slug,
        message: `${topic.slug} 的 summary 含有 Markdown 语法，该字段按纯文本渲染`,
      });
    }
    for (const source of topic.sources) {
      if (!source.href.startsWith('https://')) {
        issues.push({ topic: topic.slug, message: '资料链接必须使用 HTTPS：' + source.href });
      }
    }
  }
  return issues;
}

/**
 * 面试答案与速查表存放在 practice.ts，运行时按需加载，因此单独校验。
 * 内容合同测试会 eager 载入全部 practice 后调用它。
 */
export function validatePractices(
  topics: TopicMeta[],
  practices: TopicPractice[],
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const bySlug = new Map(practices.map(practice => [practice.slug, practice]));

  for (const topic of topics) {
    const practice = bySlug.get(topic.slug);
    if (!practice) {
      issues.push({ topic: topic.slug, message: '专题缺少 practice.ts：' + topic.slug });
      continue;
    }

    const { code, interview, reference } = practice;

    if (topic.hasCode && !code) {
      issues.push({ topic: topic.slug, message: '声明 hasCode 但缺少 code 说明：' + topic.slug });
    }
    if (!topic.hasCode && code) {
      issues.push({ topic: topic.slug, message: 'hasCode 为 false 却提供了 code 说明：' + topic.slug });
    }
    if (code && (!code.input.trim() || !code.output.trim())) {
      issues.push({ topic: topic.slug, message: 'code 的预期输入与输出都不能为空：' + topic.slug });
    }

    if (interview.followUps.length < 2 || interview.followUps.length > 4) {
      issues.push({ topic: topic.slug, message: '追问数量必须为 2 至 4：' + topic.slug });
    }

    const plainTextFields: Array<[string, string]> = [
      ['interview.answer', interview.answer],
      ...interview.followUps.map(
        (value, index): [string, string] => [`interview.followUps[${index}]`, value],
      ),
    ];
    for (const [field, value] of plainTextFields) {
      if (containsMarkdown(value)) {
        issues.push({
          topic: topic.slug,
          message: `${topic.slug} 的 ${field} 含有 Markdown 语法，该字段按纯文本渲染`,
        });
      }
    }

    if (reference) {
      if (!reference.caption.trim()) {
        issues.push({ topic: topic.slug, message: '速查表缺少标题：' + topic.slug });
      }
      if (!reference.rows.length) {
        issues.push({ topic: topic.slug, message: '速查表至少需要一行：' + topic.slug });
      }
      for (const row of reference.rows) {
        if (!row.term.trim() || !row.meaning.trim()) {
          issues.push({ topic: topic.slug, message: '速查表行缺少概念或判断：' + topic.slug });
        }
      }
    }
  }

  for (const practice of practices) {
    if (!topics.some(topic => topic.slug === practice.slug)) {
      issues.push({ topic: practice.slug, message: 'practice.ts 的 slug 没有对应专题：' + practice.slug });
    }
  }

  return issues;
}
