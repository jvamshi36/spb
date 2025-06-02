const mongoose = require('mongoose');

const miscClaimSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  attachment: { type: String, required: true }, // file path or URL
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MiscellaneousClaim', miscClaimSchema); 