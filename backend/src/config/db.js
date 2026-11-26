import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';

dotenv.config();

let mongod = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nammafix';

  // 1. Try standard connection (Local MongoDB or Atlas Cloud)
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`🌿 Connected to external MongoDB: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.warn(`ℹ️ Local MongoDB instance not detected on ${uri}.`);
    console.log('⚡ Launching Embedded In-Memory MongoDB Server...');
  }

  // 2. Automatically launch embedded in-memory MongoDB server
  try {
    mongod = await MongoMemoryServer.create({
      instance: {
        dbName: 'nammafix',
      },
    });
    const memoryUri = mongod.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(`🍃 Embedded In-Memory MongoDB connected successfully at: ${memoryUri}`);
    return conn;
  } catch (memoryError) {
    console.error('❌ Failed to start embedded MongoDB:', memoryError.message);
    return null;
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (mongod) {
    await mongod.stop();
  }
};
