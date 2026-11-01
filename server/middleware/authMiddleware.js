
const jwt = require('jsonwebtoken');
const { getIsConnected } = require('../config/db');
const User = require('../models/User');

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized. Authentication token missing.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    if (!process.env.JWT_SECRET) {
      console.error('[Auth Middleware] JWT_SECRET is not configured');

      return res.status(500).json({
        success: false,
        error: 'Server authentication configuration error'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!getIsConnected()) {
      return res.status(503).json({
        success: false,
        error: 'Database is not connected. Please try again shortly.'
      });
    }

    const user = await User.findById(decoded.id)
      .select('-passwordHash -emailVerificationToken -passwordResetToken');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User account not found'
      });
    }

    if (!user.emailVerified) {
      return res.status(403).json({
        success: false,
        code: 'EMAIL_NOT_VERIFIED',
        error: 'Please verify your email to access this resource.'
      });
    }

    req.user = user;
    next();

  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired authentication token'
      });
    }

    console.error('[Auth Middleware Error]:', err);

    return res.status(500).json({
      success: false,
      error: 'Authentication failed'
    });
  }
};

module.exports = { protect };
