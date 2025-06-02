const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  globalRules: { type: Object, default: {} }
});

module.exports = mongoose.model('Settings', settingsSchema); 