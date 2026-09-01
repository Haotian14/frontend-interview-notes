import type { ComponentType } from 'react';

export type TopicLevel = '基础' | '高频' | '进阶';

export type ContentSource = {
  label: string;
  href: string;
};

/** 代码手册条目：这篇专题的最小验证要跑什么、该看到什么。 */
export type CodeSpec = {
  input: string;
  output: string;
};

/** 速查表行；表格归属于提供它的专题。 */
export type ReferenceRow = {
  term: string;
  meaning: string;
};

export type ReferenceTable = {
  caption: string;
  rows: ReferenceRow[];
};

export type TopicMeta = {
  slug: string;
  chapter: string;
  order: number;
  title: string;
  summary: string;
  level: TopicLevel;
  minutes: number;
  keywords: string[];
  prerequisites: string[];
  related: string[];
  sources: ContentSource[];
  searchText: string;
  hasCode: boolean;
};

/**
 * 面试答案、速查表和代码条目按专题单独成文件，由专题页、/interview、/reference
 * 和 /code 按需加载。它们只服务各自的页面，放进 meta.ts 会让每个访客都下载
 * 全部专题的长文本。meta 只保留 hasCode 这类列表页就要用到的标记。
 */
export type TopicPractice = {
  slug: string;
  /** meta.hasCode 为 true 时必填，驱动 /code 的条目内容。 */
  code?: CodeSpec;
  /** 可选，驱动 /reference 的一张速查表。 */
  reference?: ReferenceTable;
  interview: {
    answer: string;
    followUps: string[];
  };
};

export type Chapter = {
  id: string;
  index: number;
  title: string;
  summary: string;
};

export type TopicModule = {
  default: ComponentType;
};

export type ValidationIssue = {
  topic?: string;
  message: string;
};
