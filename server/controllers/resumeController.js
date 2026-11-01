const { getIsConnected } = require('../config/db');
const Resume = require('../models/Resume');
const memoryStore = require('../config/memoryStore');
const { extractTextFromFile } = require('../services/parserService');

// @route POST /api/resumes/upload
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please upload a PDF or DOCX resume file' });
    }

    const { originalname, size, mimetype, buffer } = req.file;

    // Parse extracted text
    const extractedText = await extractTextFromFile(buffer, originalname);

    let resumeRecord;

    if (getIsConnected()) {
      resumeRecord = await Resume.create({
        userId: req.user._id,
        fileName: originalname,
        fileSize: size,
        fileType: mimetype,
        extractedText,
        uploadDate: new Date()
      });
    } else {
      resumeRecord = {
        _id: 'res_' + Date.now(),
        userId: req.user._id,
        fileName: originalname,
        fileSize: size,
        fileType: mimetype,
        extractedText,
        uploadDate: new Date()
      };
      memoryStore.resumes.push(resumeRecord);
    }

    return res.status(201).json({
      success: true,
      resume: {
        id: resumeRecord._id,
        fileName: resumeRecord.fileName,
        fileSize: resumeRecord.fileSize,
        fileType: resumeRecord.fileType,
        extractedSnippet: extractedText.substring(0, 300) + '...',
        uploadDate: resumeRecord.uploadDate
      }
    });
  } catch (err) {
    console.error('[Resume Upload Controller Error]:', err);
    return res.status(400).json({ success: false, error: err.message || 'Failed to process uploaded resume file' });
  }
};

// @route GET /api/resumes
const getUserResumes = async (req, res) => {
  try {
    let resumes = [];
    if (getIsConnected()) {
      resumes = await Resume.find({ userId: req.user._id }).sort({ uploadDate: -1 });
    } else {
      resumes = memoryStore.resumes.filter(r => String(r.userId) === String(req.user._id));
    }
    return res.json({ success: true, resumes });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { uploadResume, getUserResumes };
