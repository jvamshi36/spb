const User = require('../models/User');
const Role = require('../models/Role');
const DailyCheckin = require('../models/DailyCheckin');
const TravelClaim = require('../models/TravelClaim');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

exports.getAll = async (req, res) => {
  const users = await User.find().populate('assignedRoutes');
  // Fetch all roles once for efficiency
  const roles = await Role.find();
  const roleMap = Object.fromEntries(roles.map(r => [r.roleLevel, r.name]));
  const usersWithRole = users.map(u => {
    const obj = u.toObject();
    obj.role = roleMap[u.roleLevel] || null;
    return obj;
  });
  res.json(usersWithRole);
};

exports.getOne = async (req, res) => {
  const user = await User.findById(req.params.id).populate('assignedRoutes');
  if (!user) return res.status(404).json({ message: 'User not found' });
  // Fetch the role name
  const role = await Role.findOne({ roleLevel: user.roleLevel });
  const userObj = user.toObject();
  userObj.role = role ? role.name : null;
  res.json(userObj);
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { name, email, password, roleLevel, assignedRoutes, headquarter } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email already in use' });
  const hash = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hash, roleLevel, assignedRoutes, headquarter });
  await user.save();
  res.status(201).json(user);
};

exports.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { name, email, roleLevel, assignedRoutes, headquarter } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { name, email, roleLevel, assignedRoutes, headquarter, updatedAt: Date.now() },
    { new: true }
  );
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

exports.delete = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ message: 'User deleted' });
};

exports.resetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { newPassword } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ message: 'Password reset' });
};

exports.getHistory = async (req, res) => {
  const userId = req.params.id;
  const checkins = await DailyCheckin.find({ userId });
  const claims = await TravelClaim.find({ userId });
  res.json({ checkins, claims });
}; 