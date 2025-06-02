const Route = require('../models/Route');
const User = require('../models/User');
const { validationResult } = require('express-validator');

exports.getAll = async (req, res) => {
  const routes = await Route.find();
  res.json(routes);
};

exports.getOne = async (req, res) => {
  const route = await Route.findById(req.params.id);
  if (!route) return res.status(404).json({ message: 'Route not found' });
  res.json(route);
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { headquarter, from, to, distance } = req.body;
  const route = new Route({ headquarter, from, to, distance });
  await route.save();
  res.status(201).json(route);
};

exports.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { headquarter, from, to, distance } = req.body;
  const route = await Route.findByIdAndUpdate(
    req.params.id,
    { headquarter, from, to, distance },
    { new: true }
  );
  if (!route) return res.status(404).json({ message: 'Route not found' });
  res.json(route);
};

exports.delete = async (req, res) => {
  const route = await Route.findByIdAndDelete(req.params.id);
  if (!route) return res.status(404).json({ message: 'Route not found' });
  res.json({ message: 'Route deleted' });
};

exports.assignToUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { userId, routeIds } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.assignedRoutes = routeIds;
  await user.save();
  res.json({ message: 'Routes assigned to user' });
}; 