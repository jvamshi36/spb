const express = require('express');
const { auth } = require('../middleware/auth');
const reportController = require('../controllers/reportController');
const router = express.Router();

router.get('/monthly/:userId/:year/:month', auth, reportController.monthlyReport);

module.exports = router; 