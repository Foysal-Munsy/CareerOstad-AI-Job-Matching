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
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
        tls: true,
        tlsAllowInvalidCertificates: true,
        tlsAllowInvalidHostnames: true,
        connectTimeoutMS: 30000,
        socketTimeoutMS: 30000,
        maxPoolSize: 10,
        retryWrites: true
    });
    return client.db(process.env.DB_NAME).collection(collectionName);
}
