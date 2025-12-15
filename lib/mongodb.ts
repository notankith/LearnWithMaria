import { MongoClient, type Db } from "mongodb"

if (!process.env.MONGODB_URI && !process.env.MONGODB_URI_FALLBACK) {
  console.warn("No MONGODB_URI or MONGODB_URI_FALLBACK found in environment — attempting local fallback")
}

const initialUri = process.env.MONGODB_URI || process.env.MONGODB_URI_FALLBACK || "mongodb://127.0.0.1:27017"
const options = { serverSelectionTimeoutMS: 5000 }

let clientPromise: Promise<MongoClient>

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

async function createClient(uri: string): Promise<MongoClient> {
  const client = new MongoClient(uri, options)
  await client.connect()
  return client
}

async function createClientWithFallback(uri: string): Promise<MongoClient> {
  try {
    return await createClient(uri)
  } catch (err: any) {
    console.error("MongoDB initial connection failed:", err && (err.message || err))
    const fallback = process.env.MONGODB_URI_FALLBACK || "mongodb://127.0.0.1:27017"
    if (fallback && fallback !== uri) {
      console.info("Attempting MongoDB fallback to:", fallback)
      return await createClient(fallback)
    }
    throw err
  }
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = createClientWithFallback(initialUri)
  }
  clientPromise = global._mongoClientPromise
} else {
  clientPromise = createClientWithFallback(initialUri)
}

export async function getDb(): Promise<Db> {
  const client = await clientPromise
  const dbName = process.env.MONGODB_DB_NAME || "learning_platform"
  return client.db(dbName)
}

export default clientPromise
