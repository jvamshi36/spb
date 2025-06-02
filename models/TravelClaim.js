const mongoose = require('mongoose');

const travelClaimSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
  amount: { type: Number, required: true }
});

module.exports = mongoose.model('TravelClaim', travelClaimSchema); 