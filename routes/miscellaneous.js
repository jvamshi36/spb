const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMisc');
const { auth, permit } = require('../middleware/auth');
const miscController = require('../controllers/miscellaneousController');

// User submits a claim
router.post('/', auth, upload.single('attachment'), miscController.create);

// Admin: get all claims
router.get('/', auth, permit(1), miscController.getAll);

// Admin: get all miscellaneous claims for a specific user
router.get('/user/:userId', auth, miscController.getByUser);

// Admin: approve/reject
router.put('/:id/approve', auth, permit(1), miscController.approve);
router.put('/:id/reject', auth, permit(1), miscController.reject);

module.exports = router; 