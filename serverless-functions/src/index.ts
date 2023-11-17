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
import { NodeHtmlMarkdown } from 'node-html-markdown';

functions.http(
  'fetchAndUpdateQuestions',
  async (req: functions.Request, res: functions.Response) => {
    const DEFAULT_BATCH_SIZE = 50;
    const nhm = new NodeHtmlMarkdown();
    const numQuestions = req.query.numQuestions as string;
    const n = numQuestions ? parseInt(numQuestions, 10) : 500;
    const client = await getDbClient();
    connectToDb(client);
    const difficultiesCollection = await getCollection(client, QuestionDbCollections.DIFFICULTIES);
    const categoriesCollection = await getCollection(client, QuestionDbCollections.CATEGORIES);
    const questionsCollection = await getCollection(client, QuestionDbCollections.QUESTIONS);
    let currentBatchStart = 0;
    let questionsInsertedSoFar = 0;

    try {
      while (questionsInsertedSoFar < n) {
        const numQuestionsLeftToFetch = n - questionsInsertedSoFar;
        console.log(`Number of questions left to fetch: ${numQuestionsLeftToFetch}`);
        const currentBatchSize =
          numQuestionsLeftToFetch > DEFAULT_BATCH_SIZE
            ? DEFAULT_BATCH_SIZE
            : numQuestionsLeftToFetch;
        console.log(
          `Fetching LC questions ${currentBatchStart} to ${currentBatchStart + currentBatchSize}`,
        );
        const questionListQuery = getLcQuestionListQuery(currentBatchStart, currentBatchSize);
        const getQuestionSummaryListConfig = getLcEndpointRequestConfig(questionListQuery);
        const lcQuestionSummaries: LcQuestionSummary[] = await sendHttpRequest(
          getQuestionSummaryListConfig,
        ).then(({ data }) => data.data.problemsetQuestionList.questions);
        const freeLcQuestionSummaries = lcQuestionSummaries.filter((summary) => !summary.paidOnly);
        const lcQuestionDescriptions = await Promise.all(
          freeLcQuestionSummaries.map((summary) => {
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
        if (lcQuestionDescriptions.length !== freeLcQuestionSummaries.length) {
          throw new Error("Number of question descriptions doesn't match number of questions");
        }
        const questions: Question[] = freeLcQuestionSummaries.map((summary, index) => {
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
            questionsCollection
              .updateOne(
                question,
                {
                  $setOnInsert: {
                    ...question,
                    description: nhm.translate(question.description),
                    difficulty: difficultyNamesToIdMap.get(question.difficulty),
                    categories: question.categories.map((category) =>
                      categoryNamesToIdMap.get(category),
                    ),
                    isDeleted: false,
                    deletedAt: null,
                  },
                },
                { upsert: true },
              )
              .catch((error) => {
                questionsInsertedSoFar--;
                console.log(error);
              }),
          ),
        ).then(() => console.log('Finished upserting questions'));
        currentBatchStart += lcQuestionSummaries.length;
        questionsInsertedSoFar += freeLcQuestionSummaries.length;
        console.log(`Actual no. of questions fetched: ${freeLcQuestionSummaries.length}`);
        console.log(`Total no. of questions INSERTED so far: ${questionsInsertedSoFar}`);
      }
      await closeDbConnection(client);
      res.status(200).send('Finished fetching questions');
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: error });
    }
  },
);
