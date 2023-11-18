import { LcQuestionTopicTag } from './lcQuestionTopicTag';

export type LcQuestionSummary = {
  title: string;
  titleSlug: string;
  difficulty: string;
  topicTags: LcQuestionTopicTag[];
  paidOnly: boolean;
};
