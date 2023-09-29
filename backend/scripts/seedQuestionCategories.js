/* eslint-disable @typescript-eslint/no-var-requires */
const { MongoClient } = require('mongodb');
const categoriesJson = require('../data/question-categories.json');

const uri = 'mongodb://127.0.0.1:27017/';

async function connectToDatabase() {
  try {
    // Open connection to MongoDB
    const client = new MongoClient(uri);
    await client.connect().then(() => console.log('Connected to MongoDB'));

    const collection = client.db('peer-prep').collection('categories');

    await collection
      .deleteMany({})
      .then(() => console.log('Deleted all categories'));

    await collection
      .insertMany(categoriesJson)
      .then(() => console.log('Finished inserting categories'));

    // Close connection
    await client.close().then(() => console.log('Closed connection'));
  } catch (err) {
    console.error('Error connecting to MongoDB', err);
  }
}

connectToDatabase();
