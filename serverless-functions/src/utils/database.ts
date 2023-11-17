import { Collection, MongoClient, ObjectId, Document } from 'mongodb';
import { QuestionDbCollections } from '../@types/collections';

export const getDbClient = async () => {
  const url = process.env.QUESTION_SERVICE_MONGODB_URL;
  const defaultUrl = `mongodb://127.0.0.1:27017/peer-prep-question`;
  const client = new MongoClient(url ?? defaultUrl, { authSource: 'admin' });
  await client.connect().then(() => console.log('Connected to MongoDB'));
  return client;
};

export const connectToDb = async (client: MongoClient) => {
  await client.connect().then(() => console.log('Connected to MongoDB'));
};

export const getCollection = async (client: MongoClient, collectionName: QuestionDbCollections) => {
  return client.db().collection(collectionName);
};

export const getNamesToObjectIdMap = async (collection: Collection<Document>) => {
  const objectIdsByName: Map<string, ObjectId> = new Map();

  const documents = await collection.find().toArray();
  documents.forEach((document) => {
    objectIdsByName.set(document.name, document._id);
  });

  return objectIdsByName;
};

export const closeDbConnection = async (client: MongoClient) => {
  await client.close().then(() => console.log('Closed connection'));
};
