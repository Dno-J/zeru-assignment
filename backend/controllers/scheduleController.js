// 📁 controllers/scheduleController.js

import { Queue } from 'bullmq';
import Redis from 'ioredis';

const redisConnection = new Redis(process.env.REDIS_URL);
const priceQueue = new Queue('priceQueue', { connection: redisConnection });

const supportedTokens = ['usdt', 'weth', 'uni', 'link'];

const tokenMap = {
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': 'usdt',
  '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984': 'uni',
  '0x2791bca1f2de4661ed88a30c99a7a9449aa84174': 'usdt',
};

export async function schedulePriceJobs(req, res) {
  const { token, network, timestamp } = req.body;

  if (!token || !network || !timestamp) {
    return res.status(400).json({ message: 'Missing required fields: token, network, or timestamp' });
  }

  const tokenSlug = tokenMap[token.toLowerCase()] || token.toLowerCase();

  if (!supportedTokens.includes(tokenSlug)) {
    return res.status(400).json({ message: `Unsupported token: ${tokenSlug}` });
  }

  try {
    await priceQueue.add(
      'fetch-price',
      { token: tokenSlug, network, timestamp },
      { removeOnComplete: true }
    );

    console.log(`✅ Scheduled job for ${tokenSlug} on ${network} @ ${timestamp}`);
    res.json({ message: 'Job scheduled successfully!' });
  } catch (err) {
    console.error('❌ Error scheduling job:', err);
    res.status(500).json({ message: 'Failed to schedule job' });
  }
}
