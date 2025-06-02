const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { auth, permit } = require('../middleware/auth');
const auditLogger = require('../middleware/auditLogger');
const cache = require('../middleware/cache');

router.get('/', auth, permit(1), cache(3600), roleController.getAll);
router.get('/:id', auth, permit(1), param('id').isMongoId(), cache(3600), roleController.getOne);
router.post('/',
  auth, permit(1), auditLogger,
  body('roleLevel').isInt({ min: 2, max: 99 }),
  body('name').notEmpty(),
  body('permissions').isObject(),
  body('allowanceRates').isObject(),
  roleController.create
);
router.put('/:id',
  auth, permit(1), auditLogger,
  param('id').isMongoId(),
  body('name').optional().notEmpty(),
  body('permissions').optional().isObject(),
  body('allowanceRates').optional().isObject(),
  roleController.update
);
router.delete('/:id', auth, permit(1), auditLogger, param('id').isMongoId(), roleController.delete);

module.exports = router; 