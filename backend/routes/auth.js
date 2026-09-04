// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const db = require('../db');

const router = express.Router();

function signToken(user) {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    bio: user.bio,
    provider: user.provider,
    notifications_enabled: !!user.notifications_enabled
  };
}

// ---------- REGISTER ----------
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required.' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const info = db.prepare(
      'INSERT INTO users (name, email, password, provider) VALUES (?, ?, ?, ?)'
    ).run(name, email.toLowerCase(), hashed, 'local');

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid);
    const token = signToken(user);
    res.status(201).json({ token, user: publicUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong while registering. Please try again.' });
  }
});

// ---------- LOGIN ----------
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());
    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = signToken(user);
    res.json({ token, user: publicUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong while logging in. Please try again.' });
  }
});

// ---------- CURRENT USER ----------
router.get('/me', require('../middleware/auth'), (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found.' });
  res.json({ user: publicUser(user) });
});

// ================= GOOGLE OAUTH =================
// Only active if GOOGLE_CLIENT_ID / SECRET are set in .env (see passport.js setup in server.js)
router.get('/google', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.status(501).send('Google login is not configured yet. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to backend/.env');
  }
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get('/google/callback',
  (req, res, next) => {
    if (!process.env.GOOGLE_CLIENT_ID) return res.redirect(`${process.env.CLIENT_URL}/login?error=google_not_configured`);
    passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed` })(req, res, next);
  },
  (req, res) => {
    const token = signToken(req.user);
    res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
  }
);

// ================= FACEBOOK OAUTH =================
router.get('/facebook', (req, res, next) => {
  if (!process.env.FACEBOOK_APP_ID) {
    return res.status(501).send('Facebook login is not configured yet. Add FACEBOOK_APP_ID and FACEBOOK_APP_SECRET to backend/.env');
  }
  passport.authenticate('facebook', { scope: ['email'] })(req, res, next);
});

router.get('/facebook/callback',
  (req, res, next) => {
    if (!process.env.FACEBOOK_APP_ID) return res.redirect(`${process.env.CLIENT_URL}/login?error=facebook_not_configured`);
    passport.authenticate('facebook', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=facebook_failed` })(req, res, next);
  },
  (req, res) => {
    const token = signToken(req.user);
    res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
  }
);

module.exports = router;
