
import { Mongoose } from 'mongoose';

// Define the shape of the cached connection object
interface MongooseConnectionCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Extend the Node.js global object type
declare global {
  // Declare the custom global property
  var mongooseConn: MongooseConnectionCache; 
}

// This line makes the file a module
export {};