/* eslint-disable @typescript-eslint/no-var-requires */
const { MongoClient } = require('mongodb');
const questionsJson = require('../../data/questions.json');
const fs = require('fs');
const dotenv = require('dotenv');

const NODE_ENV = process.env.NODE_ENV;
dotenv.config({ path: `.env${NODE_ENV ? `.${NODE_ENV}` : ''}` });
const uri = process.env.QUESTION_SERVICE_MONGODB_URL;

const QUESTION_DESCRIPTION_DIRECTORY_PATH = 'data/question-descriptions';
const generateFilePathFromId = (id) =>
  `${QUESTION_DESCRIPTION_DIRECTORY_PATH}/${id}.md`;

const readFiles = () => {
  const fileIds = questionsJson.map((question) => question.id);
  const filesById = {};

  try {
    fileIds.forEach((fileId) => {
      const filePath = generateFilePathFromId(fileId);
      const data = fs.readFileSync(filePath, 'utf8');
      filesById[fileId] = data;
      console.log('Read and pushed:', filePath);
    });
  } catch (err) {
    console.error(`Error reading files: ${err}`);
    return [];
  }

  return filesById;
};

const getNamesToObjectIdMap = async (collection) => {
  const objectIdsByName = {};

  const documents = await collection.find().toArray();
  documents.forEach((document) => {
    objectIdsByName[document.name] = document._id;
  });

  return objectIdsByName;
};

const getCategoryIds = (database) => {
  const categoryCollection = database.collection('categories');
  return getNamesToObjectIdMap(categoryCollection);
};

const getDifficultyIds = async (database) => {
  const difficultyCollection = database.collection('difficulties');
  return getNamesToObjectIdMap(difficultyCollection);
};

async function connectToDatabase() {
  try {
    // Open connection to MongoDB
    const client = new MongoClient(uri, { authSource: 'admin' });
    await client.connect().then(() => console.log('Connected to MongoDB'));
    const database = client.db();

    const categoryIdsByName = await getCategoryIds(database);
    const difficultyIdsByName = await getDifficultyIds(database);
    const filesById = readFiles();

    const questionCollection = database.collection('questions');

    await Promise.all(
      questionsJson.map((question) =>
        questionCollection.updateOne(
          { title: question.title },
          {
            $setOnInsert: {
              ...question,
              description: filesById[question.id],
              difficulty: difficultyIdsByName[question.difficulty],
              categories: question.categories.map((c) => categoryIdsByName[c]),
              isDeleted: false,
              deletedAt: null,
            },
          },
          { upsert: true },
        ),
      ),
    )
      .then(
        async () =>
          await Promise.all(
            questionsJson.map((question) =>
              questionCollection.updateOne(
                { title: question.title },
                {
                  $set: {
                    isDeleted: false,
                    deletedAt: null,
                  },
                },
              ),
            ),
          ),
      )
      .then(() => console.log('Upserted all question categories'));

    // Close connection
    await client.close().then(() => console.log('Closed connection'));
  } catch (err) {
    console.error('Error connecting to MongoDB', err);
  }
}

connectToDatabase();
