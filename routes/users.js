const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, permit } = require('../middleware/auth');
const auditLogger = require('../middleware/auditLogger');
const cache = require('../middleware/cache');

router.get('/', auth, permit(1), cache(3600), userController.getAll); // Admin only
router.get('/:id', auth, cache(3600), userController.getOne);
router.post('/',
  auth, permit(1), auditLogger,
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('roleLevel').isInt({ min: 1, max: 99 }),
  userController.create
);
router.put('/:id',
  auth, permit(1), auditLogger,
  param('id').isMongoId(),
  body('name').optional().notEmpty(),
  body('email').optional().isEmail(),
  body('roleLevel').optional().isInt({ min: 1, max: 99 }),
  userController.update
);
router.delete('/:id', auth, permit(1), auditLogger, param('id').isMongoId(), userController.delete); // Admin only
router.post('/:id/reset-password', auth, permit(1), auditLogger, param('id').isMongoId(), body('newPassword').isLength({ min: 6 }), userController.resetPassword); // Admin only
router.get('/:id/history', auth, cache(600), userController.getHistory);

module.exports = router; 