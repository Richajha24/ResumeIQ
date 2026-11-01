const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getIsConnected } = require('../config/db');
const JobDescription = require('../models/JobDescription');
const memoryStore = require('../config/memoryStore');

router.get('/', protect, async (req, res) => {
  try {
    let jobs = [];
    if (getIsConnected()) {
      jobs = await JobDescription.find({ userId: req.user._id }).sort({ createdAt: -1 });
    } else {
      jobs = memoryStore.jobDescriptions.filter(j => String(j.userId) === String(req.user._id));
    }
    return res.json({ success: true, jobs });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
