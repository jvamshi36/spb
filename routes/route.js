const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const cache = require('../middleware/cache');
const { invalidateCache, buildKey } = require('../utils/cache');

router.get('/', cache(3600), routeController.getAll); // 1 hour
router.get('/:id', cache(3600), routeController.getOne); // 1 hour

async function invalidateRouteCache(req, res, next) {
  await invalidateCache('cache:/routes');
  if (req.params.id) await invalidateCache(buildKey('cache:/routes/' + req.params.id));
  next();
}

router.post('/', routeController.create, invalidateRouteCache);
router.put('/:id', routeController.update, invalidateRouteCache);
router.delete('/:id', routeController.delete, invalidateRouteCache);
router.post('/assign', routeController.assignToUser, invalidateRouteCache); 