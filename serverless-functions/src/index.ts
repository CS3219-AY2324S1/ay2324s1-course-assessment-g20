import * as functions from '@google-cloud/functions-framework';
import { LcQuestionSummary } from './@types/lcQuestionSummary';
import { LcQuestionContent } from './@types/lcQuestionContent';
import { QuestionDbCollections } from './@types/collections';
import {
  getLcQuestionListQuery,
  getLcQuestionContentQueryFor,
  getLcEndpointRequestConfig,
  sendHttpRequest,
} from './utils/lcGraphql';
import { Question } from './@types/question';
import {
  closeDbConnection,
  connectToDb,
  getCollection,
  getDbClient,
  getNamesToObjectIdMap,
} from './utils/database';

functions.http(
  'fetchAndUpdateQuestions',
  async (req: functions.Request, res: functions.Response) => {
    const questionListQuery = getLcQuestionListQuery(0, 50);
    const getQuestionSummaryListConfig = getLcEndpointRequestConfig(questionListQuery);
    const client = await getDbClient();
    connectToDb(client);
    const difficultiesCollection = await getCollection(client, QuestionDbCollections.DIFFICULTIES);
    const categoriesCollection = await getCollection(client, QuestionDbCollections.CATEGORIES);
    const questionsCollection = await getCollection(client, QuestionDbCollections.QUESTIONS);

    await sendHttpRequest(getQuestionSummaryListConfig)
      .then(async ({ data }) => {
        const lcQuestionSummaries: LcQuestionSummary[] = data.data.problemsetQuestionList.questions;
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
            id: index,
            title: summary.title,
            difficulty: summary.difficulty,
            categories: summary.topicTags.map((tag) => tag.name),
            description: lcQuestionDescriptions[index].content,
          };
        });

        // Insert difficulties
        const difficulties = [
          ...new Set(questions.map((question) => ({ name: question.difficulty }))),
        ];
        await Promise.all(
          difficulties.map((difficulty) =>
            difficultiesCollection.updateOne(
              difficulty,
              { $setOnInsert: difficulty },
              { upsert: true },
            ),
          ),
        ).then(() => console.log('Finished upserting difficulties'));

        // Insert categories
        const categories = [...new Set(questions.flatMap((question) => question.categories))].map(
          (category) => ({ name: category }),
        );
        await Promise.all(
          categories.map((category) =>
            categoriesCollection.updateOne(category, { $setOnInsert: category }, { upsert: true }),
          ),
        ).then(() => console.log('Finished upserting categories'));

        // Insert questions
        const difficultyNamesToIdMap = await getNamesToObjectIdMap(difficultiesCollection);
        const categoryNamesToIdMap = await getNamesToObjectIdMap(categoriesCollection);
        await Promise.all(
          questions.map((question) =>
            questionsCollection.updateOne(
              question,
              {
                $setOnInsert: {
                  ...question,
                  description: question.description,
                  difficulty: difficultyNamesToIdMap.get(question.difficulty),
                  categories: question.categories.map((category) =>
                    categoryNamesToIdMap.get(category),
                  ),
                },
              },
              { upsert: true },
            ),
          ),
        ).then(() => console.log('Upserted all questions'));

        // Close MongoDB connection
        await closeDbConnection(client);
        res.status(200).send(questions);
      })
      .catch((error) => {
        res.status(500).send({ error: error });
      });
  },
);
