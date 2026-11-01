const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { downloadPDFReport } = require('../controllers/reportController');

router.get('/:analysisId', protect, downloadPDFReport);

module.exports = router;
