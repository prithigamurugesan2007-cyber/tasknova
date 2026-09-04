// routes/tasks.js
const express = require('express');
const db = require('../db');
const requireAuth = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

// GET all tasks for logged in user (supports ?search=&status=&priority=)
router.get('/', (req, res) => {
  const { search = '', status = '', priority = '' } = req.query;
  let query = 'SELECT * FROM tasks WHERE user_id = ?';
  const params = [req.userId];

  if (search) {
    query += ' AND title LIKE ?';
    params.push(`%${search}%`);
  }
  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }
  if (priority) {
    query += ' AND priority = ?';
    params.push(priority);
  }
  query += ' ORDER BY created_at DESC';

  const tasks = db.prepare(query).all(...params);
  res.json({ tasks });
});

// GET dashboard stats
router.get('/stats', (req, res) => {
  const total = db.prepare('SELECT COUNT(*) c FROM tasks WHERE user_id = ?').get(req.userId).c;
  const completed = db.prepare("SELECT COUNT(*) c FROM tasks WHERE user_id = ? AND status = 'completed'").get(req.userId).c;
  const inProgress = db.prepare("SELECT COUNT(*) c FROM tasks WHERE user_id = ? AND status = 'in_progress'").get(req.userId).c;
  const pending = db.prepare("SELECT COUNT(*) c FROM tasks WHERE user_id = ? AND status = 'pending'").get(req.userId).c;

  const upcoming = db.prepare(
    `SELECT * FROM tasks WHERE user_id = ? AND due_date IS NOT NULL AND due_date >= date('now') ORDER BY due_date ASC LIMIT 5`
  ).all(req.userId);

  const recent = db.prepare(
    'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC LIMIT 5'
  ).all(req.userId);

  res.json({ total, completed, inProgress, pending, upcoming, recent });
});

// CREATE task
router.post('/', (req, res) => {
  const { title, description = '', category = 'General', status = 'pending', priority = 'medium', due_date = null } = req.body;
  if (!title) return res.status(400).json({ error: 'Task title is required.' });

  const info = db.prepare(
    `INSERT INTO tasks (user_id, title, description, category, status, priority, due_date)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(req.userId, title, description, category, status, priority, due_date);

  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json({ task });
});

// UPDATE task
router.put('/:id', (req, res) => {
  const task = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
  if (!task) return res.status(404).json({ error: 'Task not found.' });

  const { title, description, category, status, priority, due_date } = req.body;
  db.prepare(
    `UPDATE tasks SET title = ?, description = ?, category = ?, status = ?, priority = ?, due_date = ? WHERE id = ?`
  ).run(
    title ?? task.title,
    description ?? task.description,
    category ?? task.category,
    status ?? task.status,
    priority ?? task.priority,
    due_date ?? task.due_date,
    req.params.id
  );

  const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  res.json({ task: updated });
});

// DELETE task
router.delete('/:id', (req, res) => {
  const task = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
  if (!task) return res.status(404).json({ error: 'Task not found.' });

  db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
