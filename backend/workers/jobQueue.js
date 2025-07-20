// 📁 workers/jobQueue.js

import { Queue } from 'bullmq';
import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const connection = new Redis(process.env.REDIS_URL);

// 🔹 Define BullMQ queue (match name with worker)
const priceQueue = new Queue('priceQueue', { connection });

// 🔹 Export job-scheduling function
export async function addPriceJob(jobData) {
  await priceQueue.add('fetch-price', jobData, {
    removeOnComplete: true,
    removeOnFail: true,
  });

  console.log('📤 Job added:', jobData);
}
