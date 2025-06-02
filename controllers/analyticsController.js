const DailyCheckin = require('../models/DailyCheckin');
const TravelClaim = require('../models/TravelClaim');
const User = require('../models/User');
const Route = require('../models/Route');

exports.stats = async (req, res) => {
  const totalAllowances = await DailyCheckin.aggregate([
    { $group: { _id: null, total: { $sum: '$allowanceAmount' } } }
  ]);
  const userActivity = await DailyCheckin.aggregate([
    { $group: { _id: '$userId', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
  const topRoutes = await TravelClaim.aggregate([
    { $group: { _id: '$routeId', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);
  res.json({
    totalAllowances: totalAllowances[0]?.total || 0,
    userActivity,
    topRoutes
  });
};

exports.exportCSV = async (req, res) => {
  // Export to CSV not implemented
  res.status(501).json({ message: 'CSV export not implemented.' });
};

exports.exportPDF = async (req, res) => {
  // Export to PDF not implemented
  res.status(501).json({ message: 'PDF export not implemented.' });
}; 