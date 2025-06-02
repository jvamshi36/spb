const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login',
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  authController.login
);

router.post('/reset-password',
  body('email').isEmail(),
  body('newPassword').isLength({ min: 6 }),
  authController.resetPassword
);

router.post('/forgot-password',
  body('email').isEmail(),
  authController.forgotPassword
);

module.exports = router; 