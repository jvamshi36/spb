const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const Sentry = require('@sentry/node');

Sentry.init({ dsn: process.env.SENTRY_DSN });
app.use(Sentry.Handlers.requestHandler());

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https://your-cdn.com"],
      connectSrc: ["'self'", "https://api.yourdomain.com"],
    }
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  frameguard: { action: 'deny' },
  xssFilter: true,
  noSniff: true,
  hidePoweredBy: true,
}));

app.use(compression());

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.'
}));

app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect('https://' + req.headers.host + req.url);
  }
  next();
});

// ... existing code ...

app.use(Sentry.Handlers.errorHandler());

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
}); 