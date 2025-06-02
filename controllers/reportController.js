const PDFDocument = require('pdfkit');
const moment = require('moment');
const User = require('../models/User');
const DailyCheckin = require('../models/DailyCheckin');
const TravelClaim = require('../models/TravelClaim');
const Role = require('../models/Role');

exports.monthlyReport = async (req, res) => {
  const { userId, year, month } = req.params;
  const reqUser = req.user;

  // Only allow if admin or self
  if (reqUser.roleLevel !== 1 && reqUser._id.toString() !== userId) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  // Only allow after month is complete
  const now = moment();
  const monthEnd = moment({ year, month: month - 1 }).endOf('month');
  if (now.isBefore(monthEnd)) {
    return res.status(400).json({ message: 'Report available only after month end' });
  }

  const user = await User.findById(userId);
  const role = await Role.findOne({ roleLevel: user.roleLevel });
  // Fetch all checkins and claims for the month
  const start = moment({ year, month: month - 1 }).startOf('month');
  const end = moment({ year, month: month - 1 }).endOf('month');
  const checkins = await DailyCheckin.find({ userId, date: { $gte: start, $lte: end } });
  const claims = await TravelClaim.find({ userId, date: { $gte: start, $lte: end } }).populate('routeId');

  // Aggregate by date
  const daysInMonth = end.date();
  let rows = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = moment({ year, month: month - 1, day: d }).format('YYYY-MM-DD');
    const checkin = checkins.find(c => moment(c.date).format('YYYY-MM-DD') === dateStr);
    const claim = claims.find(c => moment(c.date).format('YYYY-MM-DD') === dateStr);
    rows.push({
      date: dateStr,
      dailyAllowance: checkin ? checkin.allowanceAmount : 0,
      travelAllowance: claim ? claim.amount : 0,
      station: claim && claim.routeId ? (claim.stationType || claim.routeId.stationType || '') : '',
      total: (checkin ? checkin.allowanceAmount : 0) + (claim ? claim.amount : 0)
    });
  }

  // Generate PDF
  const doc = new PDFDocument({ margin: 30, size: 'A4' });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=report_${user.name}_${year}_${month}.pdf`);
  doc.fontSize(18).text('Monthly Allowance Report', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Name: ${user.name}`);
  doc.text(`Role: ${role.name}`);
  doc.text(`Headquarter: ${user.headquarter}`);
  doc.text(`Mobile: ${user.mobile || '-'}`);
  doc.moveDown();

  // Table header
  doc.fontSize(12).text('Date', 30, doc.y, { continued: true });
  doc.text('Daily Allowance', 110, doc.y, { continued: true });
  doc.text('Travel Allowance', 220, doc.y, { continued: true });
  doc.text('Station', 340, doc.y, { continued: true });
  doc.text('Total', 420, doc.y);
  doc.moveDown(0.5);

  // Table rows with pagination
  let rowCount = 0;
  rows.forEach(row => {
    if (rowCount > 0 && rowCount % 30 === 0) {
      doc.addPage();
      doc.fontSize(12).text('Date', 30, doc.y, { continued: true });
      doc.text('Daily Allowance', 110, doc.y, { continued: true });
      doc.text('Travel Allowance', 220, doc.y, { continued: true });
      doc.text('Station', 340, doc.y, { continued: true });
      doc.text('Total', 420, doc.y);
      doc.moveDown(0.5);
    }
    doc.text(row.date, 30, doc.y, { continued: true });
    doc.text(row.dailyAllowance, 110, doc.y, { continued: true });
    doc.text(row.travelAllowance, 220, doc.y, { continued: true });
    doc.text(row.station, 340, doc.y, { continued: true });
    doc.text(row.total, 420, doc.y);
    doc.moveDown(0.5);
    rowCount++;
  });

  doc.end();
  doc.pipe(res);
}; 