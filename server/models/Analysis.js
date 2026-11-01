const mongoose = require('mongoose');

const AnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true
  },
  jdId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobDescription',
    required: true
  },
  jobTitle: {
    type: String,
    default: 'Target Role'
  },
  resumeFileName: {
    type: String,
    default: 'resume.pdf'
  },
  atsScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  matchRating: {
    type: String,
    enum: ['Strong Match', 'Moderate Match', 'Needs Work', 'Weak Match'],
    default: 'Moderate Match'
  },
  breakdown: {
    skillMatch: { type: Number, default: 75 },
    formattingScore: { type: Number, default: 80 },
    keywordMatch: { type: Number, default: 70 }
  },
  missingSkills: [{ type: String }],
  formattingIssues: [{ type: String }],
  suggestions: [{ type: String }],
  matchSummary: { type: String, default: '' },
  status: {
    type: String,
    enum: ['completed', 'failed'],
    default: 'completed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Analysis', AnalysisSchema);
