import type { ComponentType } from 'react';

export type TopicLevel = '基础' | '高频' | '进阶';

export type ContentSource = {
  label: string;
  href: string;
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
