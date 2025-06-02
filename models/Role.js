const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  // roleLevel: 1-11+ (unique for each role)
  roleLevel: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, default: '' }, // Optional description for UI clarity
  permissions: { type: Object, default: {} }, // Flexible: e.g., { canApprove, canEdit, canView, canDownloadReport, ... }
  allowanceRates: {
    type: Object,
    default: {
      headquarter: 0,
      exStation: 0,
      outStation: 0,
      travelPerKm: 0
    }
  },
});

module.exports = mongoose.model('Role', roleSchema); 