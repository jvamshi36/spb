const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { auth, permit } = require('../middleware/auth');
const auditLogger = require('../middleware/auditLogger');

router.get('/', auth, permit(1), settingsController.get);
router.put('/',
  auth, permit(1), auditLogger,
  body('globalRules').isObject(),
  settingsController.update
);

module.exports = router; 