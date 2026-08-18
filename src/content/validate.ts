import type { Chapter, TopicMeta, ValidationIssue } from './types';

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
    if (topic.interview.followUps.length < 2 || topic.interview.followUps.length > 4) {
      issues.push({ topic: topic.slug, message: '追问数量必须为 2 至 4：' + topic.slug });
    }
    // 这些字段会被当作纯文本渲染，写进 Markdown 语法只会原样显示出来。
    const plainTextFields: Array<[string, string]> = [
      ['summary', topic.summary],
      ['interview.answer', topic.interview.answer],
      ...topic.interview.followUps.map(
        (value, index): [string, string] => [`interview.followUps[${index}]`, value],
      ),
    ];
    for (const [field, value] of plainTextFields) {
      if (/\*\*|\[[^\]]+\]\(/.test(value)) {
        issues.push({
          topic: topic.slug,
          message: `${topic.slug} 的 ${field} 含有 Markdown 语法，该字段按纯文本渲染`,
        });
      }
    }
    if (topic.hasCode && !topic.code) {
      issues.push({ topic: topic.slug, message: '声明 hasCode 但缺少 code 说明：' + topic.slug });
    }
    if (!topic.hasCode && topic.code) {
      issues.push({ topic: topic.slug, message: 'hasCode 为 false 却提供了 code 说明：' + topic.slug });
    }
    if (topic.code && (!topic.code.input.trim() || !topic.code.output.trim())) {
      issues.push({ topic: topic.slug, message: 'code 的预期输入与输出都不能为空：' + topic.slug });
    }
    if (topic.reference) {
      if (!topic.reference.caption.trim()) {
        issues.push({ topic: topic.slug, message: '速查表缺少标题：' + topic.slug });
      }
      if (!topic.reference.rows.length) {
        issues.push({ topic: topic.slug, message: '速查表至少需要一行：' + topic.slug });
      }
      for (const row of topic.reference.rows) {
        if (!row.term.trim() || !row.meaning.trim()) {
          issues.push({ topic: topic.slug, message: '速查表行缺少概念或判断：' + topic.slug });
        }
      }
    }
    for (const source of topic.sources) {
      if (!source.href.startsWith('https://')) {
        issues.push({ topic: topic.slug, message: '资料链接必须使用 HTTPS：' + source.href });
      }
    }
  }
  return issues;
}
