const { getIsConnected } = require('../config/db');
const Analysis = require('../models/Analysis');
const Resume = require('../models/Resume');
const JobDescription = require('../models/JobDescription');
const memoryStore = require('../config/memoryStore');
const { analyzeResumeWithAI } = require('../services/aiService');

// @route POST /api/analysis/create
const createAnalysis = async (req, res) => {
  try {
    const { resumeId, jobTitle, jdText } = req.body;

    if (!resumeId || !jdText) {
      return res.status(400).json({ success: false, error: 'Resume ID and Job Description text are required' });
    }

    if (jdText.trim().length < 20) {
      return res.status(400).json({ success: false, error: 'Job description text is too short. Please provide a detailed description.' });
    }

    let resumeObj;
    if (getIsConnected()) {
      resumeObj = await Resume.findOne({ _id: resumeId, userId: req.user._id });
    } else {
      resumeObj = memoryStore.resumes.find(r => String(r._id) === String(resumeId) && String(r.userId) === String(req.user._id));
    }

    if (!resumeObj) {
      return res.status(404).json({ success: false, error: 'Resume file record not found for this candidate' });
    }

    const title = jobTitle && jobTitle.trim() ? jobTitle.trim() : 'Target Role';

    // 1. Create Job Description record
    let jdRecord;
    if (getIsConnected()) {
      jdRecord = await JobDescription.create({
        userId: req.user._id,
        jobTitle: title,
        jdText
      });
    } else {
      jdRecord = {
        _id: 'jd_' + Date.now(),
        userId: req.user._id,
        jobTitle: title,
        jdText,
        createdAt: new Date()
      };
      memoryStore.jobDescriptions.push(jdRecord);
    }

    // 2. Perform AI Analysis
    const aiResult = await analyzeResumeWithAI(resumeObj.extractedText, jdText, title);

    // 3. Create Analysis Record
    let analysisRecord;
    if (getIsConnected()) {
      analysisRecord = await Analysis.create({
        userId: req.user._id,
        resumeId: resumeObj._id,
        jdId: jdRecord._id,
        jobTitle: title,
        resumeFileName: resumeObj.fileName,
        atsScore: aiResult.atsScore,
        matchRating: aiResult.matchRating,
        breakdown: aiResult.breakdown,
        missingSkills: aiResult.missingSkills,
        formattingIssues: aiResult.formattingIssues,
        suggestions: aiResult.suggestions,
        matchSummary: aiResult.matchSummary,
        status: 'completed'
      });
    } else {
      analysisRecord = {
        _id: 'anl_' + Date.now(),
        userId: req.user._id,
        resumeId: resumeObj._id,
        jdId: jdRecord._id,
        jobTitle: title,
        resumeFileName: resumeObj.fileName,
        atsScore: aiResult.atsScore,
        matchRating: aiResult.matchRating,
        breakdown: aiResult.breakdown,
        missingSkills: aiResult.missingSkills,
        formattingIssues: aiResult.formattingIssues,
        suggestions: aiResult.suggestions,
        matchSummary: aiResult.matchSummary,
        status: 'completed',
        createdAt: new Date()
      };
      memoryStore.analyses.push(analysisRecord);
    }

    return res.status(201).json({
      success: true,
      analysis: analysisRecord
    });
  } catch (err) {
    console.error('[Create Analysis Error]:', err);
    return res.status(500).json({ success: false, error: 'Analysis failed: ' + err.message });
  }
};

// @route GET /api/analysis
const getUserAnalyses = async (req, res) => {
  try {
    const { search } = req.query;
    let list = [];

    if (getIsConnected()) {
      const query = { userId: req.user._id };
      if (search) {
        query.jobTitle = { $regex: search, $options: 'i' };
      }
      list = await Analysis.find(query).sort({ createdAt: -1 });
    } else {
      list = memoryStore.analyses.filter(a => String(a.userId) === String(req.user._id));
      if (search) {
        const s = search.toLowerCase();
        list = list.filter(a => (a.jobTitle || '').toLowerCase().includes(s));
      }
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return res.json({ success: true, count: list.length, analyses: list });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// @route GET /api/analysis/:id
const getAnalysisById = async (req, res) => {
  try {
    const { id } = req.params;
    let item;

    if (getIsConnected()) {
      item = await Analysis.findOne({ _id: id, userId: req.user._id });
    } else {
      item = memoryStore.analyses.find(a => String(a._id) === String(id) && String(a.userId) === String(req.user._id));
    }

    if (!item) {
      return res.status(404).json({ success: false, error: 'Analysis report not found' });
    }

    return res.json({ success: true, analysis: item });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// @route DELETE /api/analysis/:id
const deleteAnalysis = async (req, res) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      await Analysis.deleteOne({ _id: id, userId: req.user._id });
    } else {
      memoryStore.analyses = memoryStore.analyses.filter(a => !(String(a._id) === String(id) && String(a.userId) === String(req.user._id)));
    }

    return res.json({ success: true, message: 'Analysis deleted successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { createAnalysis, getUserAnalyses, getAnalysisById, deleteAnalysis };
