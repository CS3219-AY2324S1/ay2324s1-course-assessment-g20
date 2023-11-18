import axios, { AxiosRequestConfig } from 'axios';

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
      },
      paidOnly: isPaidOnly
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

export const getLcQuestionContentQueryFor = (titleSlug: string) =>
  JSON.stringify({
    query: `query questionContent($titleSlug: String!) {
  question(titleSlug: $titleSlug) {
    content
  }
}`,
    variables: { titleSlug: titleSlug },
  });

const LEETCODE_GRAPHQL_ENDPOINT = 'https://leetcode.com/graphql/';

export const getLcEndpointRequestConfig = (data: any): AxiosRequestConfig => ({
  method: 'post',
  maxBodyLength: Infinity,
  url: LEETCODE_GRAPHQL_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
  },
  data: data,
});

export const sendHttpRequest = (requestConfig: AxiosRequestConfig) => {
  return axios.request(requestConfig);
};
