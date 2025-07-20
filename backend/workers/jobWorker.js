// backend/workers/jobWorker.js

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { Worker } from 'bullmq';
import Redis from 'ioredis';
import handlePriceJob from '../services/priceJobHandler.js';

// 🔹 Resolve .env path (works in ESM mode)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// 🔹 Validate env vars
if (!process.env.MONGO_URI || !process.env.REDIS_HOST || !process.env.REDIS_PASSWORD) {
  console.error('❌ Missing required env vars: MONGO_URI, REDIS_HOST or REDIS_PASSWORD');
  process.exit(1);
}

// 🔹 MongoDB Connect
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected (worker)'))
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

// 🔹 Redis Connect
const connection = new Redis({
  host: process.env.REDIS_HOST,
  port: 6379,
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null
});

// 🔹 Start Worker
const worker = new Worker('price-queue', handlePriceJob, { connection });

console.log('🔄 Worker is running and listening for jobs...');
