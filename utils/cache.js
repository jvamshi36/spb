const Redis = require('ioredis');

// Create Redis client
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: 2,
  retryStrategy: times => Math.min(times * 50, 2000),
});

redis.on('error', err => {
  console.error('[Redis error]', err.message);
});

// Helper to build cache keys
const buildKey = (base, id) => id ? `${base}:${id}` : base;

// Get from cache
async function getFromCache(key) {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error('[Redis getFromCache]', err.message);
    return null;
  }
}

// Set to cache with TTL (seconds)
async function setToCache(key, value, ttl) {
  try {
    await redis.set(key, JSON.stringify(value), 'EX', ttl);
    console.log('[Redis] Setting cache for', key, 'with TTL', ttl);
  } catch (err) {
    console.error('[Redis setToCache]', err.message);
  }
}

// Invalidate cache key
async function invalidateCache(key) {
  try {
    await redis.del(key);
  } catch (err) {
    console.error('[Redis invalidateCache]', err.message);
  }
}

module.exports = {
  redis,
  getFromCache,
  setToCache,
  invalidateCache,
  buildKey,
}; 