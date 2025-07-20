// 📁 backend/workers/jobworker.js

import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// 🔹 Dynamically resolve path to .env at project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import mongoose from 'mongoose';
import { Worker } from 'bullmq';
import Redis from 'ioredis';
import priceJobHandler from '../services/priceJobHandler.js';

// 🔍 Debug log for env hydration
console.log('🔍 MONGO_URI:', process.env.MONGO_URI);
console.log('🔍 REDIS_URL:', process.env.REDIS_URL);

// 🔹 Redis Client with reconnection logic
const redis = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  reconnectOnError: () => true,
});

redis.on('connect', () => console.log('✅ Redis connected'));
redis.on('error', err => console.error('❌ Redis error:', err));

// 🔹 MongoDB Client
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI, {
  socketTimeoutMS: 30000,
  serverSelectionTimeoutMS: 10000,
})

  .then(() => console.log('✅ MongoDB connected (worker)'))
  .catch(err => console.error('❌ MongoDB connection error:', err.message));

// 🔹 Worker to process price jobs
const worker = new Worker('price-queue', priceJobHandler, {
  connection: redis,
  concurrency: 5,
});

worker.on('completed', (job, result) => {
  console.log(`🎯 Completed job ${job.id}`, result);
});

worker.on('failed', (job, err) => {
  console.error(`❌ Job ${job.id} failed`, err);
});

console.log('🔄 Worker is running and listening for jobs...');
