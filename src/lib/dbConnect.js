// dbconnect.js
import { MongoClient, ServerApiVersion } from 'mongodb';

export const collectionNamesObj = {
  userCollection: 'sample-user',
  jobsCollection: 'jobs',
  adviceCollection: 'advice',
  applicationsCollection: 'applications',
  messagesCollection: 'messages',
  savedJobsCollection: 'saved-jobs',
};

const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;
if (!uri) throw new Error('MONGO_URI environment variable is not defined');
if (!dbName) throw new Error('DB_NAME environment variable is not defined');

const options = {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true }
};

const client = new MongoClient(uri, options);
let connected = false;

async function ensureConnected() {
  if (!connected) {
    await client.connect();
    connected = true;
  }
}

export default async function dbConnect(collectionName) {
  await ensureConnected();
  return client.db(dbName).collection(collectionName);

}

// graceful shutdown (optional, good for production)
process.on('SIGINT', async () => {
  try { await client.close(); } catch (e) { }
  process.exit(0);
});