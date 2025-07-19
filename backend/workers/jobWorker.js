import { Worker } from 'bullmq';
import mongoose from 'mongoose';
import axios from 'axios';
import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB Setup
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected (worker)'))
  .catch(err => console.error('❌ MongoDB connection failed:', err));

// Redis Connection
const redis = new Redis(process.env.REDIS_URL);

// BullMQ Worker Definition
const priceWorker = new Worker('token-price-queue', async job => {
  try {
    const { token, network } = job.data;

    // Example: Simulate fetching price from external API
    const response = await axios.get(`https://api.coincap.io/v2/assets/${token}`);
    const price = response.data?.data?.priceUsd || null;

    console.log(`💰 ${token} price on ${network}: $${price}`);

    // Save to MongoDB (example schema)
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
