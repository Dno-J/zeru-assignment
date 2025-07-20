// backend/workers/jobworker.js

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Worker } from 'bullmq';
import Redis from 'ioredis';
import handlePriceJob from '../services/priceJobHandler.js';

// 🔹 Load .env from root
dotenv.config({
  path: new URL('../.env', import.meta.url).pathname // ensures compatibility in ESM
});

// 🔹 Validate Mongo URI
if (!process.env.MONGO_URI) {
  console.error('❌ Missing MONGO_URI in environment variables');
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

// 🔹 Validate Redis Config
if (!process.env.REDIS_HOST || !process.env.REDIS_PASSWORD) {
  console.error('❌ Missing Redis credentials in environment variables');
  process.exit(1);
}

// 🔹 Redis Connection with BullMQ-safe config
const connection = new Redis({
  host: process.env.REDIS_HOST,
  port: 6379,
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null
});

// 🔹 Worker Init
const worker = new Worker('price-queue', handlePriceJob, {
  connection
});

console.log('🔄 Worker is running and listening for jobs...');
