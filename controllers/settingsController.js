const Settings = require('../models/Settings');
const { validationResult } = require('express-validator');

exports.get = async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({ globalRules: {} });
  res.json(settings);
};

exports.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({ globalRules: {} });
  settings.globalRules = req.body.globalRules;
  await settings.save();
  res.json(settings);
}; 