require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.disable('x-powered-by');
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/companies', require('./routes/companies'));
app.use('/api/offers', require('./routes/offers'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/conversations', require('./routes/conversations'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/storage', require('./routes/storage'));
app.use('/api/cvAnalytics', require('./routes/cvAnalytics'));
app.use('/api/recommendations', require('./routes/recommendations'));
app.use('/api/references', require('./routes/references'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Backend running on port ${PORT}`));
