import * as functions from '@google-cloud/functions-framework';
import { LcQuestionSummary, getLcQuestionListQuery } from './lcQuestionList';
import { LcQuestionContent, getLcQuestionContentQueryFor } from './lcQuestionContent';
import { Question } from './question';
import { getLcEndpointRequestConfig, sendHttpRequest } from './sendHttpRequest';

functions.http(
  'fetchAndUpdateQuestions',
  async (req: functions.Request, res: functions.Response) => {
    const questionListQuery = getLcQuestionListQuery(0, 50);
    const getQuestionSummaryListConfig = getLcEndpointRequestConfig(questionListQuery);
    await sendHttpRequest(getQuestionSummaryListConfig)
      .then(({ data }) => {
        const lcQuestionSummaries: LcQuestionSummary[] = data.data.problemsetQuestionList.questions;
        return lcQuestionSummaries;
      })
      .then(async (lcQuestionSummaries) => {
        const lcQuestionDescriptions = await Promise.all(
          lcQuestionSummaries.map((summary) => {
            const lcQuestionDescriptionQuery = getLcQuestionContentQueryFor(summary.titleSlug);
            const getQuestionDescriptionConfig = getLcEndpointRequestConfig(
              lcQuestionDescriptionQuery,
            );
            return sendHttpRequest(getQuestionDescriptionConfig).then(({ data }) => {
              const lcQuestionDescription: LcQuestionContent = data.data.question;
              return lcQuestionDescription;
            });
          }),
        );
        if (lcQuestionDescriptions.length !== lcQuestionSummaries.length) {
          throw new Error("Number of question descriptions doesn't match number of questions");
        }
        const questions: Question[] = lcQuestionSummaries.map((summary, index) => {
          return {
            title: summary.title,
            difficulty: summary.difficulty,
            categories: summary.topicTags.map((tag) => tag.name),
            description: lcQuestionDescriptions[index].content,
          };
        });
        res.status(200).send(questions);
      })
      .catch((error) => {
        res.status(500).send({ error: error });
      });
  },
);
