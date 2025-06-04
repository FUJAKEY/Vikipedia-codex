async function loadMostVisited() {
  try {
    const res = await fetch('/api/most-visited');
    const data = await res.json();
    const list = document.getElementById('visitedList');
    list.innerHTML = '';
    data.forEach(item => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `https://en.wikipedia.org/wiki/${encodeURIComponent(item.article)}`;
      a.textContent = item.article;
      a.target = '_blank';
      li.appendChild(a);
      list.appendChild(li);
    });
  } catch (e) {
    console.error('Failed to load most visited pages');
  }
}

async function search() {
  const query = document.getElementById('searchInput').value;
  if (!query) return;
  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const results = await res.json();
    const list = document.getElementById('searchResults');
    list.innerHTML = '';
    results.forEach(r => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `https://en.wikipedia.org/?curid=${r.pageid}`;
      a.textContent = r.title;
      a.target = '_blank';
      li.appendChild(a);
      list.appendChild(li);
    });
  } catch (e) {
    console.error('Search failed');
  }
}

document.addEventListener('DOMContentLoaded', loadMostVisited);

async function getRandom() {
  try {
    const res = await fetch('/api/random');
    const data = await res.json();
    const container = document.getElementById('randomResult');
    container.innerHTML = '';
    const title = document.createElement('a');
    title.href = data.url;
    title.target = '_blank';
    title.textContent = data.title;
    const p = document.createElement('p');
    p.textContent = data.extract;
    container.appendChild(title);
    container.appendChild(p);
  } catch (e) {
    console.error('Failed to fetch random article');
  }
}
