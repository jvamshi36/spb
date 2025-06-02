const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../audit.log');

function auditLogger(req, res, next) {
  const user = req.user ? `${req.user.email} (ID: ${req.user._id})` : 'Guest';
  const log = `[${new Date().toISOString()}] ${user} - ${req.method} ${req.originalUrl}\n`;
  fs.appendFile(logFile, log, err => { if (err) console.error('Audit log error:', err); });
  next();
}

module.exports = auditLogger; 