
import mongoose from 'mongoose';
import { MONGODB_URL } from '@/config/config';





//---------- React ki tarah not connect the databse simple because here server rerender frequently that cause problems...
// We use the global object to cache the connection.
// TypeScript now recognizes 'mongooseConn' due to the global.d.ts file.
// The structure { conn: null, promise: null } matches the MongooseConnectionCache interface.
let cached = global.mongooseConn || { conn: null, promise: null };

global.mongooseConn = cached;

export async function ConnectDB() {
  if (!MONGODB_URL) {
    throw new Error("MONGODB_URI is missing in .env.local");
  }

  // ##1. If DB already connected and cached - return that connection immediately.
  if (cached.conn) {
    console.log("Using cached DB connection.");
    return cached.conn;
  }

  // ##2. If no connection, but a connection request is already running:
  if (!cached.promise) {
    console.log("Starting new DB connection process.");
    // Start the connection and save the Promise to the cache.
    // This prevents multiple simultaneous connections (race condition).
    cached.promise = mongoose.connect(MONGODB_URL).then((mongoose) => {
      console.log("DB connection successful.");
      return mongoose;
    });
  }

  // 3. Wait for the connection promise to resolve.
  cached.conn = await cached.promise;
  return cached.conn;
}