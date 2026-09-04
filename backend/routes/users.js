// routes/users.js
const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const requireAuth = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

// UPDATE profile (name, bio, avatar)
router.put('/profile', (req, res) => {
  const { name, bio, avatar } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId);

  db.prepare('UPDATE users SET name = ?, bio = ?, avatar = ? WHERE id = ?').run(
    name ?? user.name,
    bio ?? user.bio,
    avatar ?? user.avatar,
    req.userId
  );

  const updated = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId);
  res.json({
    user: {
      id: updated.id, name: updated.name, email: updated.email,
      avatar: updated.avatar, bio: updated.bio, provider: updated.provider,
      notifications_enabled: !!updated.notifications_enabled
    }
  });
});

// CHANGE password
router.put('/password', async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId);

  if (!user.password) {
    return res.status(400).json({ error: 'This account signed up via social login and has no password to change.' });
  }
  const match = await bcrypt.compare(currentPassword || '', user.password);
  if (!match) return res.status(401).json({ error: 'Current password is incorrect.' });
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters.' });
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashed, req.userId);
  res.json({ success: true });
});

// UPDATE settings (notifications toggle)
router.put('/settings', (req, res) => {
  const { notifications_enabled } = req.body;
  db.prepare('UPDATE users SET notifications_enabled = ? WHERE id = ?').run(
    notifications_enabled ? 1 : 0,
    req.userId
  );
  res.json({ success: true, notifications_enabled: !!notifications_enabled });
});

module.exports = router;
