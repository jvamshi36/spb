const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const allowanceController = require('../controllers/allowanceController');
const { auth } = require('../middleware/auth');
const auditLogger = require('../middleware/auditLogger');

router.post('/checkin',
  auth, auditLogger,
  body('date').notEmpty(),
  body('checkInTime').notEmpty(),
  body('inputs').isObject(),
  allowanceController.checkIn
);
router.post('/checkout',
  auth, auditLogger,
  body('date').notEmpty(),
  body('checkOutTime').notEmpty(),
  allowanceController.checkOut
);
router.post('/travel-claim',
  auth, auditLogger,
  body('date').notEmpty(),
  body('routeId').notEmpty(),
  allowanceController.travelClaim
);

module.exports = router; 