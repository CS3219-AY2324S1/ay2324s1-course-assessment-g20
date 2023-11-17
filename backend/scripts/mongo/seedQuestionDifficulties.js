/* eslint-disable @typescript-eslint/no-var-requires */
const { MongoClient } = require('mongodb');
const difficultiesJson = require('../../data/question-difficulties.json');
const dotenv = require('dotenv');

const NODE_ENV = process.env.NODE_ENV;
dotenv.config({ path: `.env${NODE_ENV ? `.${NODE_ENV}` : ''}` });
const uri = process.env.QUESTION_SERVICE_MONGODB_URL;

async function connectToDatabase() {
  try {
    // Open connection to MongoDB
    const client = new MongoClient(uri, { authSource: 'admin' });
    await client.connect().then(() => console.log('Connected to MongoDB'));

    const collection = client.db().collection('difficulties');

    // await collection
    //   .deleteMany({})
    //   .then(() => console.log('Deleted all difficulties'));

    for (const d of difficultiesJson) {
      await collection.updateOne(d, { $setOnInsert: d }, { upsert: true });
    }
    console.log('Finished upserting difficulties');

    // Close connection
    await client.close().then(() => console.log('Closed connection'));
  } catch (err) {
    console.error('Error connecting to MongoDB', err);
  }
}

connectToDatabase();
