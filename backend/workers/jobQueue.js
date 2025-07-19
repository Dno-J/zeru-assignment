// 📁 workers/jobQueue.js

const { Queue } = require('bullmq');
const Redis = require('ioredis');
require('dotenv').config();

// 🔹 Redis connection
const connection = new Redis(process.env.REDIS_URL);

// 🔹 Define BullMQ queue (match name with worker)
const priceQueue = new Queue('priceQueue', { connection });

// 🔹 Export job-scheduling function
exports.addPriceJob = async (jobData) => {
  await priceQueue.add('fetch-price', jobData, {
    removeOnComplete: true,
    removeOnFail: true,
  });

  console.log('📤 Job added:', jobData);
};
