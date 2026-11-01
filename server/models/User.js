
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },

  passwordHash: {
    type: String,
    required: [true, 'Password hash is required']
  },

  mobile: {
    type: String,
    default: ''
  },

  role: {
    type: String,
    enum: ['candidate', 'admin'],
    default: 'candidate'
  },

  // Email verification
  emailVerified: {
    type: Boolean,
    default: false
  },

  emailVerificationToken: {
    type: String,
    default: null
  },

  emailVerificationExpires: {
    type: Date,
    default: null
  },

  // Password reset
  passwordResetToken: {
    type: String,
    default: null
  },

  passwordResetExpires: {
    type: Date,
    default: null
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);
