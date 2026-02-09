require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

/* =======================
   Middleware
======================= */
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/* =======================
   Routes
======================= */
app.use('/api/employees', require('./routes/employees'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/leaves', require('./routes/leaves'));

/* =======================
   Health Check
======================= */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'HRMS Lite API is running',
    timestamp: new Date().toISOString()
  });
});

/* =======================
   404 Handler
======================= */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

/* =======================
   Global Error Handler
======================= */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

/* =======================
   Environment Validation
======================= */
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

/* =======================
   MongoDB Connection
======================= */
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 Health check: /api/health`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  });

module.exports = app;
