import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
}

const cache = global.mongooseCache ?? { conn: null, promise: null };
global.mongooseCache = cache;

export async function connectMongo(): Promise<typeof mongoose> {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI is not set");
  }

  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    cache.promise = mongoose.connect(uri).then((m) => m);
  }

  cache.conn = await cache.promise;
  return cache.conn;
}
