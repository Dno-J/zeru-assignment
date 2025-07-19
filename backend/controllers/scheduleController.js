// 📁 controllers/scheduleController.js

const { Queue } = require('bullmq');
const Redis = require('ioredis');

// Connect to Redis
const redisConnection = new Redis(process.env.REDIS_URL);

// Create a BullMQ queue named 'priceQueue'
const priceQueue = new Queue('priceQueue', { connection: redisConnection });

// Supported tokens for scheduling (slugs or mapped names)
const supportedTokens = ['usdt', 'weth', 'uni', 'link'];

// Optional: Map full token addresses to slugs if needed
const tokenMap = {
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': 'usdt', // USDC → usdt fallback
  '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984': 'uni',
  '0x2791bca1f2de4661ed88a30c99a7a9449aa84174': 'usdt', // USDC on Polygon
  // Add more mappings as needed
};

// 🔹 Controller: POST /schedule
exports.schedulePriceJobs = async (req, res) => {
  const { token, network, timestamp } = req.body;

  // Validate input
  if (!token || !network || !timestamp) {
    return res.status(400).json({ message: 'Missing required fields: token, network, or timestamp' });
  }

  // Normalize token name
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
};
