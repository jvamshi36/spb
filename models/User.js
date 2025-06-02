const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roleLevel: { type: Number, required: true }, // 1-7
  assignedRoutes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Route' }],
  resetToken: String,
  resetTokenExpiry: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  headquarter: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema); 