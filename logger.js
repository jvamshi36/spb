const winston = require('winston');
require('winston-daily-rotate-file');

const transport = new winston.transports.DailyRotateFile({
  filename: 'logs/app-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d'
});

const logger = winston.createLogger({
  transports: [transport]
});

module.exports = logger; 