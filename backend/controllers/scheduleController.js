// 📁 controllers/scheduleController.js

const { Queue } = require('bullmq');
const Redis = require('ioredis');

// Connect to Redis
const redisConnection = new Redis(process.env.REDIS_URL);

// Create a BullMQ queue named 'priceQueue'
const priceQueue = new Queue('priceQueue', { connection: redisConnection });

// Supported tokens for scheduling
const supportedTokens = ['usdt', 'weth', 'uni', 'link'];

// Controller to handle GET /schedule?token=...&network=...
exports.schedulePriceJobs = async (req, res) => {
  const { token, network } = req.query;

  // Validate query parameters
  if (!token || !network) {
    return res.status(400).json({ error: 'Missing token or network in query' });
  }

  // Ensure token is supported
  if (!supportedTokens.includes(token.toLowerCase())) {
    return res.status(400).json({ error: `Unsupported token: ${token}` });
  }

  try {
    // Schedule a job for each supported token
    const jobs = supportedTokens.map((tkn) =>
      priceQueue.add('fetch-price', { token: tkn, network }, { removeOnComplete: true })
    );

    await Promise.all(jobs);

    console.log(`✅ Scheduled jobs for ${supportedTokens.join(', ')} on ${network}`);
    res.json({ message: 'Jobs scheduled successfully', tokens: supportedTokens, network });
  } catch (err) {
    console.error('❌ Error scheduling jobs:', err);
    res.status(500).json({ error: 'Failed to schedule jobs' });
  }
};
