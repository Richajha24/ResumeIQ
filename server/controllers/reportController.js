const { getIsConnected } = require('../config/db');
const Analysis = require('../models/Analysis');
const User = require('../models/User');
const memoryStore = require('../config/memoryStore');
const { generatePDFReport } = require('../services/pdfReportService');

// @route GET /api/reports/:analysisId
const downloadPDFReport = async (req, res) => {
  try {
    const { analysisId } = req.params;
    let analysisObj;
    let userObj;

    if (getIsConnected()) {
      analysisObj = await Analysis.findById(analysisId);
      userObj = await User.findById(req.user._id);
    } else {
      analysisObj = memoryStore.analyses.find(a => String(a._id) === String(analysisId));
      userObj = memoryStore.users.find(u => String(u._id) === String(req.user._id));
    }

    if (!analysisObj) {
      return res.status(404).json({ success: false, error: 'Analysis record not found' });
    }

    // Security check: Candidate can only download their own report (unless admin)
    if (req.user.role !== 'admin' && String(analysisObj.userId) !== String(req.user._id)) {
      return res.status(403).json({ success: false, error: 'Forbidden: Access to this report is restricted' });
    }

    const pdfBuffer = await generatePDFReport(analysisObj, userObj || req.user);

    const safeTitle = (analysisObj.jobTitle || 'Resume_Analysis').replace(/[^a-z0-9]/gi, '_');
    const filename = `ResumeIQ_Report_${safeTitle}_${analysisId.substring(0, 6)}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    return res.send(pdfBuffer);
  } catch (err) {
    console.error('[PDF Download Error]:', err);
    return res.status(500).json({ success: false, error: 'Failed to generate PDF report: ' + err.message });
  }
};

module.exports = { downloadPDFReport };
