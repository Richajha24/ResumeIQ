
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const { getIsConnected } = require('../config/db');
const User = require('../models/User');
const sendEmail = require('../config/email');

const generateToken = (id, role) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }

  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Store only a hash of the random token in MongoDB.
const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

const requireDatabase = (res) => {
  if (!getIsConnected()) {
    res.status(503).json({
      success: false,
      error: 'Database is not connected. Please try again shortly.'
    });
    return false;
  }

  return true;
};

// @route POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, mobile } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Full name, email, and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long'
      });
    }

    if (!requireDatabase(res)) return;

    const cleanEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: cleanEmail });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'An account with this email already exists'
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const rawToken = crypto.randomBytes(32).toString('hex');

    const user = await User.create({
      fullName: fullName.trim(),
      email: cleanEmail,
      passwordHash,
      mobile: mobile || '',
      role: 'candidate',
      emailVerified: false,
      emailVerificationToken: hashToken(rawToken),
      emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    const verificationUrl =
      `${process.env.CLIENT_URL}/verify-email?token=${rawToken}&email=${encodeURIComponent(cleanEmail)}`;

    try {
      await sendEmail({
        to: cleanEmail,
        subject: 'Verify your ResumeIQ email',
        text: `Hello ${user.fullName},\n\nPlease verify your email by opening this link:\n${verificationUrl}\n\nThis link expires in 24 hours.`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#26352c;">
            <h2>Welcome to ResumeIQ, ${user.fullName}!</h2>
            <p>Please verify your email address to activate your account.</p>
            <p>
              <a href="${verificationUrl}"
                 style="display:inline-block;padding:12px 20px;background:#355b45;color:white;text-decoration:none;border-radius:6px;">
                Verify Email
              </a>
            </p>
            <p>This link expires in 24 hours.</p>
            <p>If you did not create this account, you can ignore this email.</p>
          </div>
        `
      });
    } catch (emailError) {
      console.error('[Verification Email Error]:', emailError.message);

      return res.status(201).json({
        success: true,
        message: 'Account created, but the verification email could not be sent. Please request a new verification email.',
        emailSent: false
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Account created. Please check your email to verify your account.',
      emailSent: true
    });

  } catch (err) {
    console.error('[Auth Error Register]:', err);

    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        error: 'An account with this email already exists'
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Registration failed'
    });
  }
};

// @route POST /api/auth/verify-email
const verifyEmail = async (req, res) => {
  try {
    const { token, email } = req.body;

    if (!token || !email) {
      return res.status(400).json({
        success: false,
        error: 'Verification token and email are required'
      });
    }

    if (!requireDatabase(res)) return;

    const cleanEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: cleanEmail,
      emailVerificationToken: hashToken(token),
      emailVerificationExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Verification link is invalid or has expired'
      });
    }

    user.emailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;

    await user.save();

    return res.json({
      success: true,
      message: 'Email verified successfully. You can now sign in.'
    });

  } catch (err) {
    console.error('[Auth Error Verify Email]:', err);

    return res.status(500).json({
      success: false,
      error: 'Email verification failed'
    });
  }
};

// @route POST /api/auth/resend-verification
const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    if (!requireDatabase(res)) return;

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    // Avoid revealing whether an email is registered.
    if (!user || user.emailVerified) {
      return res.json({
        success: true,
        message: 'If the account exists and needs verification, an email will be sent.'
      });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');

    user.emailVerificationToken = hashToken(rawToken);
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await user.save();

    const verificationUrl =
      `${process.env.CLIENT_URL}/verify-email?token=${rawToken}&email=${encodeURIComponent(cleanEmail)}`;

    await sendEmail({
      to: cleanEmail,
      subject: 'Your ResumeIQ verification link',
      text: `Verify your email using this link:\n${verificationUrl}\n\nThis link expires in 24 hours.`,
      html: `
        <h2>Verify your ResumeIQ email</h2>
        <p><a href="${verificationUrl}">Verify Email</a></p>
        <p>This link expires in 24 hours.</p>
      `
    });

    return res.json({
      success: true,
      message: 'If the account exists and needs verification, an email will be sent.'
    });

  } catch (err) {
    console.error('[Auth Error Resend Verification]:', err);

    return res.status(500).json({
      success: false,
      error: 'Could not send verification email'
    });
  }
};

// @route POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password'
      });
    }

    if (!requireDatabase(res)) return;

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password credentials'
      });
    }

    if (!user.emailVerified) {
      return res.status(403).json({
        success: false,
        code: 'EMAIL_NOT_VERIFIED',
        error: 'Please verify your email before signing in.'
      });
    }

    const token = generateToken(user._id, user.role);

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        mobile: user.mobile || ''
      }
    });

  } catch (err) {
    console.error('[Auth Error Login]:', err);

    return res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
};

// @route POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    if (!requireDatabase(res)) return;

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({
      email: cleanEmail,
      emailVerified: true
    });

    // Always return the same message to avoid account enumeration.
    const message = 'If an eligible account exists, a password reset link will be sent.';

    if (!user) {
      return res.json({ success: true, message });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');

    user.passwordResetToken = hashToken(rawToken);
    user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);

    await user.save();

    const resetUrl =
      `${process.env.CLIENT_URL}/reset-password?token=${rawToken}&email=${encodeURIComponent(cleanEmail)}`;

    await sendEmail({
      to: cleanEmail,
      subject: 'Reset your ResumeIQ password',
      text: `Use this link to reset your password:\n${resetUrl}\n\nThis link expires in 15 minutes.`,
      html: `
        <h2>Reset your ResumeIQ password</h2>
        <p>We received a request to reset your password.</p>
        <p><a href="${resetUrl}">Reset Password</a></p>
        <p>This link expires in 15 minutes. If you did not request this, ignore this email.</p>
      `
    });

    return res.json({ success: true, message });

  } catch (err) {
    console.error('[Auth Error Forgot Password]:', err);

    return res.status(500).json({
      success: false,
      error: 'Could not process password reset request'
    });
  }
};

// @route POST /api/auth/reset-password
const resetPassword = async (req, res) => {
  try {
    const { token, email, password } = req.body;

    if (!token || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Token, email, and new password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long'
      });
    }

    if (!requireDatabase(res)) return;

    const cleanEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: cleanEmail,
      passwordResetToken: hashToken(token),
      passwordResetExpires: { $gt: new Date() },
      emailVerified: true
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Password reset link is invalid or has expired'
      });
    }

    user.passwordHash = await bcrypt.hash(password, 12);
    user.passwordResetToken = null;
    user.passwordResetExpires = null;

    await user.save();

    return res.json({
      success: true,
      message: 'Password reset successfully. You can now sign in.'
    });

  } catch (err) {
    console.error('[Auth Error Reset Password]:', err);

    return res.status(500).json({
      success: false,
      error: 'Could not reset password'
    });
  }
};

// @route GET /api/auth/me
const getMe = async (req, res) => {
  return res.json({
    success: true,
    user: {
      id: req.user._id,
      fullName: req.user.fullName,
      email: req.user.email,
      role: req.user.role,
      mobile: req.user.mobile || ''
    }
  });
};

module.exports = {
  registerUser,
  verifyEmail,
  resendVerification,
  loginUser,
  forgotPassword,
  resetPassword,
  getMe
};
