const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const { getAdminStats, getAdminUsers, getAdminAnalyses } = require('../controllers/adminController');

router.use(protect);
router.use(adminOnly);

router.get('/stats', getAdminStats);
router.get('/users', getAdminUsers);
router.get('/analyses', getAdminAnalyses);

module.exports = router;
