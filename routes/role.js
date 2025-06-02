const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const cache = require('../middleware/cache');
const { invalidateCache, buildKey } = require('../utils/cache');

router.get('/', cache(3600), roleController.getAll); // 1 hour
router.get('/:id', cache(3600), roleController.getOne); // 1 hour

async function invalidateRoleCache(req, res, next) {
  await invalidateCache('cache:/roles');
  if (req.params.id) await invalidateCache(buildKey('cache:/roles/' + req.params.id));
  next();
}

router.post('/', roleController.create, invalidateRoleCache);
router.put('/:id', roleController.update, invalidateRoleCache);
router.delete('/:id', roleController.delete, invalidateRoleCache); 