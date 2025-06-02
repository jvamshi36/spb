const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const routeController = require('../controllers/routeController');
const { auth, permit } = require('../middleware/auth');
const auditLogger = require('../middleware/auditLogger');
const cache = require('../middleware/cache');

router.get('/', auth, cache(3600), routeController.getAll);
router.get('/:id', auth, param('id').isMongoId(), cache(3600), routeController.getOne);
router.post('/',
  auth, permit(1), auditLogger,
  body('headquarter').notEmpty(),
  body('from').notEmpty(),
  body('to').notEmpty(),
  body('distance').isNumeric(),
  routeController.create
);
router.put('/:id',
  auth, permit(1), auditLogger,
  param('id').isMongoId(),
  body('headquarter').optional().notEmpty(),
  body('from').optional().notEmpty(),
  body('to').optional().notEmpty(),
  body('distance').optional().isNumeric(),
  routeController.update
);
router.delete('/:id', auth, permit(1), auditLogger, param('id').isMongoId(), routeController.delete);
router.post('/assign',
  auth, permit(1), auditLogger,
  body('userId').isMongoId(),
  body('routeIds').isArray(),
  routeController.assignToUser
);

module.exports = router; 