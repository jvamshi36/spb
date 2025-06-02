const mongoose = require('mongoose');

const dailyCheckinSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  checkInTime: Date,
  checkOutTime: Date,
  inputs: { type: Object, default: {} }, // e.g., location, task type
  allowanceAmount: { type: Number, default: 0 }
});

dailyCheckinSchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model('DailyCheckin', dailyCheckinSchema); 