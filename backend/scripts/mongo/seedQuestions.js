/* eslint-disable @typescript-eslint/no-var-requires */
const { MongoClient, ObjectId } = require('mongodb');
const questionsJson = require('../../data/questions.json');
const fs = require('fs').promises;

const generateFilePaths = async () => {
  const questionDescFilePaths = [];

  for (let i = 1; i <= questionsJson.length; i++) {
    questionDescFilePaths.push(`data/question-descriptions/${i}.md`);
  }

  return questionDescFilePaths;
};

const readFiles = async () => {
  try {
    const questionDescFilePaths = await generateFilePaths();
    const descriptions = [];

    await Promise.all(
      questionDescFilePaths.map(async (filePath, index) => {
        try {
          const data = await fs.readFile(filePath, 'utf8');
          descriptions[index] = data;
          console.log('Read and pushed:', filePath);
        } catch (err) {
          console.error(`Error reading file ${filePath}: ${err}`);
        }
      }),
    );

    return descriptions;
  } catch (error) {
    console.error('Error generating file paths:', error);
    return [];
  }
};

const uri = 'mongodb://127.0.0.1:27017/';

async function connectToDatabase() {
  try {
    // Open connection to MongoDB
    const client = new MongoClient(uri);
    await client.connect().then(() => console.log('Connected to MongoDB'));

    const database = client.db('peer-prep');

    const questionCategoriesCollection =
      database.collection('questioncategories');
    const questionCollection = database.collection('questions');
    const difficultyCollection = database.collection('difficulties');
    const categoryCollection = database.collection('categories');

    await questionCategoriesCollection
      .deleteMany({})
      .then(() => console.log('Deleted all question categories'));
    await questionCollection
      .deleteMany({})
      .then(() => console.log('Deleted all questions'));

    await readFiles().then(
      async (descriptions) =>
        await questionCollection
          .insertMany(
            await Promise.all(
              questionsJson.map(async (question, index) => {
                return {
                  _id: new ObjectId(question.id),
                  title: question.title,
                  description: descriptions[index],
                  difficulty: await difficultyCollection
                    .findOne({
                      name: question.difficulty,
                    })
                    .then((difficulty) => difficulty._id),
                };
              }),
            ),
          )
          .then(async (res) => {
            console.log(res);
            await questionCategoriesCollection.insertMany(
              await Promise.all(
                Object.keys(res.insertedIds).flatMap((id, index) => {
                  return questionsJson[index].categories.map(
                    async (category) => {
                      return {
                        question: res.insertedIds[id],
                        category: await categoryCollection
                          .findOne({ name: category })
                          .then((category) => category._id),
                      };
                    },
                  );
                }),
              ),
            );
          })
          .then(() => console.log('Inserted all question categories')),
    );

    // Close connection
    await client.close().then(() => console.log('Closed connection'));
  } catch (err) {
    console.error('Error connecting to MongoDB', err);
  }
}

connectToDatabase();
