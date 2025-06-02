const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const cache = require('../middleware/cache');

// ... existing code ...
router.get('/', cache(3600), userController.getAll); // 1 hour for all users
router.get('/:id', cache(3600), userController.getOne); // 1 hour for profile
router.get('/:id/history', cache(600), userController.getHistory); // 10 min for history

// Invalidate cache on update/create/delete
const { invalidateCache, buildKey } = require('../utils/cache');

async function invalidateUserCache(req, res, next) {
  const id = req.params.id || (req.body && req.body._id);
  if (id) {
    await invalidateCache(buildKey('cache:/users/' + id));
    await invalidateCache(buildKey('cache:/users/' + id + '/history'));
    await invalidateCache('cache:/users');
  }
  next();
}

router.post('/', userController.create, invalidateUserCache);
router.put('/:id', userController.update, invalidateUserCache);
router.delete('/:id', userController.delete, invalidateUserCache);

// ... existing code ... 