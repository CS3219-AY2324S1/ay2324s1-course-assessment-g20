export const getLcQuestionListQuery = (skip: number, limit: number) =>
  JSON.stringify({
    query: `query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
  problemsetQuestionList: questionList(
    categorySlug: $categorySlug
    limit: $limit
    skip: $skip
    filters: $filters
  ) {
    questions: data {
      difficulty
      title
      titleSlug
      topicTags {
        name
      }
    }
  }
}`,
    variables: {
      categorySlug: '',
      skip: skip,
      limit: limit,
      filters: {},
    },
  });

export type LcQuestionTopicTag = {
  name: string;
};

export type LcQuestionSummary = {
  title: string;
  titleSlug: string;
  difficulty: string;
  topicTags: LcQuestionTopicTag[];
};
