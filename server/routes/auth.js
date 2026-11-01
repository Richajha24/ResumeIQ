
const express = require('express');
const router = express.Router();

const {
    registerUser,
    verifyEmail,
    resendVerification,
    loginUser,
    forgotPassword,
    resetPassword,
    getMe
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

// Registration and login
router.post('/register', registerUser);
router.post('/login', loginUser);

// Email verification
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);

// Password reset
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Authenticated user
router.get('/me', protect, getMe);

module.exports = router;
