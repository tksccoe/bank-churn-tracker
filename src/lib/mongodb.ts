import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';

// ── Mongoose connection (for Account model) ──────────────────────────────────

const g = global as typeof globalThis & {
  _mongoose?: { promise: Promise<void> | null; connected: boolean };
};

if (!g._mongoose) {
  g._mongoose = { promise: null, connected: false };
}

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('Please define MONGODB_URI in your .env.local file');
  if (g._mongoose!.connected) return;
  if (!g._mongoose!.promise) {
    g._mongoose!.promise = mongoose.connect(uri).then(() => {
      g._mongoose!.connected = true;
    });
  }
  await g._mongoose!.promise;
}

// ── Native MongoClient (for NextAuth MongoDBAdapter) ─────────────────────────

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function createClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    // Deferred rejection so the module can be imported at build time
    return Promise.reject(
      new Error('Please define MONGODB_URI in your .env.local file')
    );
  }
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = new MongoClient(uri).connect();
    }
    return global._mongoClientPromise;
  }
  return new MongoClient(uri).connect();
}

export const clientPromise: Promise<MongoClient> = createClientPromise();
