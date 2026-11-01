
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
  path: path.resolve(__dirname, '../.env')
});

const { connectDB } = require('./config/db');

const app = express();

// Core Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'ResumeIQ API',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/resumes', require('./routes/resumes'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/analysis', require('./routes/analysis'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/admin', require('./routes/admin'));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Express Global Error]:', err);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    error: err.message || 'An unexpected internal server error occurred'
  });
});

const PORT = process.env.PORT || 5001;

// Start server only after successful database connection
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log('==================================================');
      console.log(` ResumeIQ Express Server running on port ${PORT}`);
      console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('==================================================');
    });
  } catch (error) {
    console.error('[Server Startup Failed]:', error.message);
    process.exit(1);
  }
};

startServer();
