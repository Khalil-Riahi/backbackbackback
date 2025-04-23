
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    default: null,
    validate: {
      validator: function (value) {
        // If the user logs in with Google, password is not required
        return this.googleId ? true : !!value;
      },
      message: 'Please provide a password',
    },
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    default: null,
    required: [function () {
      return !this.googleId;
    }, 'Please confirm your password'],
    validate: [
      {
        validator: function (value) {
          return this.googleId ? true : !!value;
        },
        message: 'Please provide a password',
      },
      {
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords are not the same!',
      },
    ],
  },
  googleId: {
    type: String,
    default: null,
  },
  phone: {
    type: Number,
    default: null,
  },
  points: {
    type: Number,
    default: 0,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  // Only run if password was modified and exists
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = function (candidatePassword, userPassword) {
  return bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);
module.exports = User;