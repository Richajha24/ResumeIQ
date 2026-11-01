const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');
const { uploadResume, getUserResumes } = require('../controllers/resumeController');

router.post('/upload', protect, upload.single('resume'), uploadResume);
router.get('/', protect, getUserResumes);

module.exports = router;
