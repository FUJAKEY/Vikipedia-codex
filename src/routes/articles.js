const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const router = express.Router();
const dbPath = path.join(__dirname, '..', 'db', 'wiki.db');
const db = new sqlite3.Database(dbPath);

// Initialize table
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL
  )`);
});

router.get('/', (req, res) => {
  const { q } = req.query;
  let sql = 'SELECT id, title FROM articles';
  const params = [];
  if (q) {
    sql += ' WHERE title LIKE ?';
    params.push(`%${q}%`);
  }
  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error');
    }
    res.render('index', { articles: rows });
  });
});

router.get('/new', (req, res) => {
  res.render('new');
});

router.post('/', (req, res) => {
  const { title, content } = req.body;
  db.run('INSERT INTO articles (title, content) VALUES (?, ?)', [title, content], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error');
    }
    res.redirect(`/articles/${this.lastID}`);
  });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM articles WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error');
    }
    if (!row) return res.status(404).send('Article not found');
    res.render('show', { article: row });
  });
});

module.exports = router;
