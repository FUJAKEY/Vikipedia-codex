const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

// fetch top viewed pages of yesterday
app.get('/api/most-visited', async (req, res) => {
  try {
    const yesterday = new Date(Date.now() - 86400000);
    const year = yesterday.getUTCFullYear();
    const month = String(yesterday.getUTCMonth() + 1).padStart(2, '0');
    const day = String(yesterday.getUTCDate()).padStart(2, '0');
    const url = `https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia/all-access/${year}/${month}/${day}`;
    const response = await axios.get(url);
    const articles = response.data.items[0].articles.slice(0, 10);
    res.json(articles);
  } catch (err) {
    res.status(500).json({error: 'Failed to fetch data'});
  }
});

// search Wikipedia
app.get('/api/search', async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({error: 'Missing query'});
  }
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json`;
    const { data } = await axios.get(url);
    res.json(data.query.search);
  } catch (err) {
    res.status(500).json({error: 'Failed to search'});
  }
});

// fetch a random article summary
app.get('/api/random', async (req, res) => {
  try {
    const url = 'https://en.wikipedia.org/api/rest_v1/page/random/summary';
    const { data } = await axios.get(url);
    res.json({
      title: data.title,
      extract: data.extract,
      url: data.content_urls.desktop.page
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch random article' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
