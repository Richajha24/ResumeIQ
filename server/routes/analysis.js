const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createAnalysis, getUserAnalyses, getAnalysisById, deleteAnalysis } = require('../controllers/analysisController');

router.post('/create', protect, createAnalysis);
router.get('/', protect, getUserAnalyses);
router.get('/:id', protect, getAnalysisById);
router.delete('/:id', protect, deleteAnalysis);

module.exports = router;
