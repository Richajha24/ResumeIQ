const { getIsConnected } = require('../config/db');
const User = require('../models/User');
const Analysis = require('../models/Analysis');
const Resume = require('../models/Resume');
const memoryStore = require('../config/memoryStore');

// @route GET /api/admin/stats
const getAdminStats = async (req, res) => {
  try {
    let totalUsers = 0;
    let totalCandidates = 0;
    let totalAnalyses = 0;
    let totalResumes = 0;
    let averageAtsScore = 0;

    if (getIsConnected()) {
      totalUsers = await User.countDocuments();
      totalCandidates = await User.countDocuments({ role: 'candidate' });
      totalAnalyses = await Analysis.countDocuments();
      totalResumes = await Resume.countDocuments();

      const scoreAgg = await Analysis.aggregate([
        { $group: { _id: null, avgScore: { $avg: '$atsScore' } } }
      ]);
      averageAtsScore = scoreAgg.length > 0 ? Math.round(scoreAgg[0].avgScore) : 78;
    } else {
      totalUsers = memoryStore.users.length;
      totalCandidates = memoryStore.users.filter(u => u.role === 'candidate').length;
      totalAnalyses = memoryStore.analyses.length;
      totalResumes = memoryStore.resumes.length;

      if (totalAnalyses > 0) {
        const sum = memoryStore.analyses.reduce((acc, a) => acc + (a.atsScore || 0), 0);
        averageAtsScore = Math.round(sum / totalAnalyses);
      } else {
        averageAtsScore = 78;
      }
    }

    return res.json({
      success: true,
      stats: {
        totalUsers,
        totalCandidates,
        totalAnalyses,
        totalResumes,
        averageAtsScore,
        reportsGenerated: totalAnalyses
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// @route GET /api/admin/users
const getAdminUsers = async (req, res) => {
  try {
    let users = [];

    if (getIsConnected()) {
      users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    } else {
      users = memoryStore.users.map(u => ({
        _id: u._id,
        fullName: u.fullName,
        email: u.email,
        role: u.role,
        mobile: u.mobile || '',
        createdAt: u.createdAt
      }));
    }

    return res.json({ success: true, count: users.length, users });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// @route GET /api/admin/analyses
const getAdminAnalyses = async (req, res) => {
  try {
    let list = [];

    if (getIsConnected()) {
      list = await Analysis.find()
        .select('-missingSkills -formattingIssues -suggestions -matchSummary')
        .sort({ createdAt: -1 })
        .limit(50);
    } else {
      list = memoryStore.analyses.map(a => ({
        _id: a._id,
        jobTitle: a.jobTitle,
        resumeFileName: a.resumeFileName,
        atsScore: a.atsScore,
        matchRating: a.matchRating,
        createdAt: a.createdAt
      }));
    }

    return res.json({ success: true, count: list.length, analyses: list });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { getAdminStats, getAdminUsers, getAdminAnalyses };
