// server.js - TaskNova backend entry point

const path = require('path');

// Load backend/.env explicitly
require('dotenv').config({
  path: path.join(__dirname, '.env')
});

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./passportConfig');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/users');

const app = express();

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
  })
);

// Parse JSON requests
app.use(express.json());

// Session - required for OAuth handshake
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'fallback_secret',
    resave: false,
    saveUninitialized: false
  })
);

// Initialize Passport
app.use(passport.initialize());

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'TaskNova API is running'
  });
});

// Authentication routes
app.use('/api/auth', authRoutes);

// Task routes
app.use('/api/tasks', taskRoutes);

// User routes
app.use('/api/users', userRoutes);

// Fallback error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);

  res.status(500).json({
    error: 'Unexpected server error.'
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`TaskNova backend running on http://localhost:${PORT}`);
});