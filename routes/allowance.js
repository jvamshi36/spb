const express = require('express');
const router = express.Router();
const allowanceController = require('../controllers/allowanceController');
const cache = require('../middleware/cache');
const { invalidateCache, buildKey } = require('../utils/cache');

// ... existing code ...
// Invalidate cache on allowance changes
async function invalidateAllowanceCache(req, res, next) {
  const userId = req.user?._id || req.user?.id;
  if (userId) {
    await invalidateCache(buildKey('cache:/users/' + userId + '/history'));
    await invalidateCache('cache:/analytics');
  }
  next();
}

router.post('/checkin', allowanceController.checkIn, invalidateAllowanceCache);
router.post('/checkout', allowanceController.checkOut, invalidateAllowanceCache);
router.post('/travel', allowanceController.travelClaim, invalidateAllowanceCache);

// ... existing code ... 