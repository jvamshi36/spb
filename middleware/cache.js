const { getFromCache, setToCache, buildKey } = require('../utils/cache');

// TTLs in seconds
const DEFAULT_TTL = 60 * 10; // 10 min
const PROFILE_TTL = 60 * 60; // 1 hour

// Middleware to cache GET requests
function cacheMiddleware(ttl = DEFAULT_TTL) {
  return async (req, res, next) => {
    if (req.method !== 'GET') return next();
    console.log('Cache middleware called for:', req.method, req.originalUrl);
    try {
      // Use URL + user ID (if available) as cache key
      const userId = req.user ? req.user.id || req.user._id : '';
      const key = buildKey(`cache:${req.originalUrl}`, userId);
      console.log('Cache key for request:', key);
      const cached = await getFromCache(key);
      if (cached) {
        console.log('Cache hit for', key);
        return res.json(cached);
      }
      // Monkey-patch res.json to cache the response
      const origJson = res.json.bind(res);
      res.json = (body) => {
        setToCache(key, body, ttl);
        return origJson(body);
      };
      next();
    } catch (err) {
      // On Redis error, just proceed
      next();
    }
  };
}

module.exports = cacheMiddleware; 