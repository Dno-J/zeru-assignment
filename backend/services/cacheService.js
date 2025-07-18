// 📁 services/cacheService.js

const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL);

// 🔹 Set a value in Redis with optional TTL (default: 60 seconds)
exports.setCache = async (key, value, ttl = 60) => {
  await redis.set(key, JSON.stringify(value), 'EX', ttl);
};

// 🔹 Get a value from Redis and parse it
exports.getCache = async (key) => {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
};
