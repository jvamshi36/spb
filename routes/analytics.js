const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { auth, permit } = require('../middleware/auth');
const auditLogger = require('../middleware/auditLogger');
const cache = require('../middleware/cache');

router.get('/stats', auth, permit(1), auditLogger, cache(600), analyticsController.stats);
router.get('/export/csv', auth, permit(1), auditLogger, analyticsController.exportCSV);
router.get('/export/pdf', auth, permit(1), auditLogger, analyticsController.exportPDF);

module.exports = router; 