import { MongoClient, ServerApiVersion } from "mongodb"

export const collectionNamesObj = {
    userCollection: "sample-user",
    jobsCollection: "jobs",
    adviceCollection: "advice",
    applicationsCollection: "applications",
    messagesCollection: "messages",
    savedJobsCollection: "saved-jobs",
}
export default function dbConnect(collectionName) {
    const uri = process.env.MONGO_URI;
    
    if (!uri) {
        throw new Error("MONGO_URI environment variable is not defined");
    }
    
    if (!process.env.DB_NAME) {
        throw new Error("DB_NAME environment variable is not defined");
    }
    
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: false, // Make less strict
            deprecationErrors: false,
        },
        // Remove problematic TLS settings
        connectTimeoutMS: 10000,
        socketTimeoutMS: 10000,
        maxPoolSize: 5,
        retryWrites: true,
        retryReads: true,
        // Let MongoDB handle SSL automatically
    });
    
    return client.db(process.env.DB_NAME).collection(collectionName);
}
