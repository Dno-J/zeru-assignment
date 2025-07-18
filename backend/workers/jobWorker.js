// 📁 workers/jobWorker.js

const { Worker } = require('bullmq');
const Redis = require('ioredis');
const mongoose = require('mongoose');
const PriceModel = require('../models/Price');
require('dotenv').config();

// 🔹 Connect to Redis
const redisConnection = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null, // Prevents retry errors during long jobs
});

// 🔹 Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected (worker)'))
  .catch((err) => console.error('❌ MongoDB error (worker):', err));

// 🔹 Create a BullMQ worker that listens to 'priceQueue'
const worker = new Worker('priceQueue', async (job) => {
  const { token, network } = job.data;
  console.log(`🔄 Processing job: ${token} on ${network}`);

  try {
    // 🔹 Generate a mock price (replace with Alchemy later)
    const mockPrice = (Math.random() * 2).toFixed(3);

    // 🔹 Save the price to MongoDB
    await PriceModel.create({
      token: token.toLowerCase(),
      network: network.toLowerCase(),
      price: mockPrice,
      timestamp: new Date(), // Required for sorting and retrieval
    });

    console.log(`💰 ${token.toUpperCase()} price on ${network}: $${mockPrice}`);
    return { token, price: mockPrice };
  } catch (err) {
    console.error(`❌ Failed to fetch price for ${token}:`, err);
    throw err; // Ensures job is marked as failed
  }
}, {
  connection: redisConnection,
  concurrency: 5, // Allows up to 5 jobs to run in parallel
});

// 🔹 Log job completion
worker.on('completed', (job) => {
  console.log(`✅ Job completed: ${job.id}`);
});

// 🔹 Log job failure
worker.on('failed', (job, err) => {
  console.error(`❌ Job failed: ${job.id}`, err.message);
});
