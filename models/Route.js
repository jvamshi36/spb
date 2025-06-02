const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  headquarter: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  distance: { type: Number, required: true } // in km
});

module.exports = mongoose.model('Route', routeSchema); 