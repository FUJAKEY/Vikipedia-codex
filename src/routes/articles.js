const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const dbDir = path.join(__dirname, '..', 'db');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}
const dbPath = path.join(dbDir, 'wiki.json');
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify([]));
}

function loadArticles() {
  return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
}

function saveArticles(articles) {
  fs.writeFileSync(dbPath, JSON.stringify(articles, null, 2));
}

router.get('/', (req, res) => {
  const { q } = req.query;
  let articles = loadArticles();
  if (q) {
    const lower = q.toLowerCase();
    articles = articles.filter(a => a.title.toLowerCase().includes(lower));
  }
  res.render('index', { articles });
});

router.get('/new', (req, res) => {
  res.render('new');
});

router.post('/', (req, res) => {
  const { title, content } = req.body;
  const articles = loadArticles();
  const newId = articles.length ? articles[articles.length - 1].id + 1 : 1;
  const article = { id: newId, title, content };
  articles.push(article);
  saveArticles(articles);
  res.redirect(`/articles/${article.id}`);
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const articles = loadArticles();
  const article = articles.find(a => a.id === Number(id));
  if (!article) return res.status(404).send('Article not found');
  res.render('show', { article });
});

module.exports = router;
