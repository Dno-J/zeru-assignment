// 📁 workers/jobQueue.js

const { Queue } = require('bullmq');
const Redis = require('ioredis');

// 🔹 Connect to Redis using the URL from .env
const connection = new Redis(process.env.REDIS_URL);

// 🔹 Create a BullMQ queue named 'priceQueue'
// This queue is used to schedule jobs from the /schedule route
const priceQueue = new Queue('priceQueue', { connection });

// 🔹 Export a reusable function to add jobs to the queue
exports.addPriceJob = async (jobData) => {
  await priceQueue.add('fetch-price', jobData, {
    removeOnComplete: true, // Clean up completed jobs
    removeOnFail: true,     // Clean up failed jobs
  });

  console.log('📤 Job added:', jobData);
};
