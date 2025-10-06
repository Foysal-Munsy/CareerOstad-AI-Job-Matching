import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const collectionNamesObj = {
  userCollection: 'sample-user',
  jobsCollection: 'jobs',
  adviceCollection: 'advice',
  applicationsCollection: 'applications',
  messagesCollection: 'messages',
  savedJobsCollection: 'saved-jobs',
};

export default async function dbConnect(collectionName) {
  if (!client.topology?.isConnected()) {
    await client.connect();
  }
  return client.db(process.env.DB_NAME).collection(collectionName);
}
