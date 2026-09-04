// db.js - SQLite database setup. Creates tasknova.db automatically on first run.
const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'tasknova.db'));
db.pragma('journal_mode = WAL');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT,
  provider TEXT DEFAULT 'local',
  avatar TEXT,
  bio TEXT DEFAULT '',
  notifications_enabled INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT DEFAULT 'General',
  status TEXT DEFAULT 'pending',       -- pending | in_progress | completed
  priority TEXT DEFAULT 'medium',      -- low | medium | high
  due_date TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`);

module.exports = db;
