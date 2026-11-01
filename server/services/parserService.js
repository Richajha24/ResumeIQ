const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const path = require('path');

const extractTextFromFile = async (fileBuffer, fileName) => {
  const ext = path.extname(fileName).toLowerCase();
  let text = '';

  try {
    if (ext === '.pdf') {
      const data = await pdfParse(fileBuffer);
      text = data.text || '';
    } else if (ext === '.docx' || ext === '.doc') {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      text = result.value || '';
    } else {
      text = fileBuffer.toString('utf-8');
    }

    // Clean whitespace and special control characters
    text = text.replace(/\r\n/g, '\n').replace(/[ \t]+/g, ' ').trim();

    if (!text || text.length < 20) {
      throw new Error('Extracted text is empty or unreadable. Please ensure the document is not an image-only PDF.');
    }

    return text;
  } catch (err) {
    console.error(`[Parser Error] ${fileName}:`, err.message);
    throw new Error(err.message || 'Failed to extract text from resume file.');
  }
};

module.exports = { extractTextFromFile };
