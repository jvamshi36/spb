const DailyCheckin = require('../models/DailyCheckin');
const TravelClaim = require('../models/TravelClaim');
const Route = require('../models/Route');
const ruleEngine = require('../utils/ruleEngine');
const { validationResult } = require('express-validator');
const logger = require('../logger');

exports.checkIn = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { date, checkInTime, inputs, condition } = req.body;
  const userId = req.user._id;
  // Prevent multiple check-ins per day
  const existing = await DailyCheckin.findOne({ userId, date });
  if (existing) return res.status(400).json({ message: 'Already checked in today' });
  // Combine date and time into a full ISO string
  const checkInDateTime = new Date(`${date}T${checkInTime}`);
  // Fetch user's role for allowance rates
  const user = await require('../models/User').findById(userId);
  const role = user ? await require('../models/Role').findOne({ roleLevel: user.roleLevel }) : null;
  let allowanceAmount = 0;
  if (role && role.allowanceRates && condition && role.allowanceRates[condition] !== undefined) {
    allowanceAmount = parseFloat(role.allowanceRates[condition]);
  }
  const checkin = new DailyCheckin({ userId, date, checkInTime: checkInDateTime, inputs, condition, allowanceAmount });
  await checkin.save();
  logger.info(`User ${userId} checked in on ${date} (${condition})`);
  res.status(201).json(checkin);
};

exports.checkOut = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { date, checkOutTime } = req.body;
  const userId = req.user._id;
  const checkin = await DailyCheckin.findOne({ userId, date });
  if (!checkin) return res.status(404).json({ message: 'No check-in found' });
  // Combine date and time into a full ISO string
  const checkOutDateTime = new Date(`${date}T${checkOutTime}`);
  checkin.checkOutTime = checkOutDateTime;
  // Do NOT overwrite allowanceAmount here!
  await checkin.save();
  logger.info(`User ${userId} checked out on ${date}`);
  res.json(checkin);
};

exports.travelClaim = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { date, routeId, stationType } = req.body;
  const userId = req.user._id;
  // Fetch user to check assigned routes
  const user = await require('../models/User').findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (!user.assignedRoutes.map(r => r.toString()).includes(routeId)) {
    return res.status(403).json({ message: 'Route not assigned to user' });
  }
  const route = await Route.findById(routeId);
  if (!route) return res.status(404).json({ message: 'Route not found' });
  // Fetch user's role for travelPerKm
  const role = user ? await require('../models/Role').findOne({ roleLevel: user.roleLevel }) : null;
  if (!role || !role.allowanceRates || typeof role.allowanceRates.travelPerKm !== 'number') {
    return res.status(400).json({ message: 'User role or travel rate not configured' });
  }
  // Validate stationType
  const validTypes = ['headquarter', 'exStation', 'outStation'];
  if (!validTypes.includes(stationType)) {
    return res.status(400).json({ message: 'Invalid station type' });
  }
  const amount = route.distance * role.allowanceRates.travelPerKm;
  const claim = new TravelClaim({ userId, date, routeId, stationType, amount });
  await claim.save();
  logger.info(`User ${userId} submitted travel claim for route ${routeId} on ${date}`);
  res.status(201).json(claim);
}; 