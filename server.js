const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/errorHandler');
require('dotenv').config();

const app = express();
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8081']
}));
app.use(express.json());
app.use(morgan('dev'));

const limiter = rateLimit({
  windowMs: (parseInt(process.env.RATE_LIMIT_WINDOW) || 15) * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100
});
app.use(limiter);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/roles', require('./routes/roles'));
app.use('/api/routes', require('./routes/routes'));
app.use('/api/allowances', require('./routes/allowances'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/miscellaneous', require('./routes/miscellaneous'));
app.use('/api/reports', require('./routes/reports'));


app.use(errorHandler);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err)); 