/* eslint-disable @typescript-eslint/no-var-requires */
const { MongoClient } = require('mongodb');
const categoriesJson = require('../../data/question-categories.json');
const dotenv = require('dotenv');

const NODE_ENV = process.env.NODE_ENV;
dotenv.config({ path: `.env${NODE_ENV ? `.${NODE_ENV}` : ''}` });
const uri = process.env.QUESTION_SERVICE_MONGODB_URL;

async function connectToDatabase() {
  try {
    // Open connection to MongoDB
    const client = new MongoClient(uri, { authSource: 'admin' });
    await client.connect().then(() => console.log('Connected to MongoDB'));

    const collection = client.db().collection('categories');

    // await collection
    //   .deleteMany({})
    //   .then(() => console.log('Deleted all categories'));

    await Promise.all(
      categoriesJson.map((c) =>
        collection.updateOne(c, { $setOnInsert: c }, { upsert: true }),
      ),
    ).then(() => console.log('Finished upserting categories'));

    // Close connection
    await client.close().then(() => console.log('Closed connection'));
  } catch (err) {
    console.error('Error connecting to MongoDB', err);
  }
}

connectToDatabase();
