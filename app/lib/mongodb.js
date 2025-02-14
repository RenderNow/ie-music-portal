import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

// Optionally include TLS options if needed by your MongoDB instance
const options = {
  tls: true,
  // tlsAllowInvalidCertificates: true, // Uncomment only for testing/self-signed certs
};

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export async function connectToDatabase() {
  const client = await clientPromise;
  return { db: client.db("opencampus") }; // Ensure "opencampus" is the correct database name
}

