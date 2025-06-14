const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const dbPath = path.join(__dirname, 'db', 'wiki.db');
const db = new sqlite3.Database(dbPath);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
const articleRouter = require('./routes/articles');
app.use('/articles', articleRouter);

app.get('/', (req, res) => {
  res.redirect('/articles');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
