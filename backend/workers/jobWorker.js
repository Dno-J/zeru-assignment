// 📁 workers/jobWorker.js

import { Worker } from 'bullmq';
import mongoose from 'mongoose';
import axios from 'axios';
import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

// 🔹 MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected (worker)'))
  .catch(err => console.error('❌ MongoDB connection failed:', err));

// 🔹 Redis Setup
const redis = new Redis(process.env.REDIS_URL);

// 🔹 Define BullMQ Worker (same queue name as jobQueue)
const priceWorker = new Worker('priceQueue', async job => {
  try {
    const { token, network } = job.data;

    const response = await axios.get(`https://api.coincap.io/v2/assets/${token}`);
    const price = response.data?.data?.priceUsd || null;

    console.log(`💰 ${token} price on ${network}: $${price}`);

    const TokenPrice = mongoose.model('TokenPrice', new mongoose.Schema({
      token: String,
      network: String,
      price: String,
      timestamp: { type: Date, default: Date.now }
    }));

    await TokenPrice.create({ token, network, price });
    console.log(`✅ Job completed: ${job.id}`);
  } catch (err) {
    console.error(`❌ Error processing job ${job.id}:`, err);
  }
}, { connection: redis });

console.log('🔄 Worker is running and listening for jobs...');
