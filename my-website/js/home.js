/*const API_KEY = 'dfd8d0c0e19038ba3059fc9043e64c68';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/original';
let currentItem;

// Store full lists
let allMovies = [];
let allTVShows = [];
let allAnime = [];

// Track how many are shown
let shownMovies = 0;
let shownTV = 0;
let shownAnime = 0;

const ITEMS_PER_LOAD = 12; // Show 12 at a time

async function fetchTrending(type) {
  const res = await fetch(`${BASE_URL}/trending/${type}/week?api_key=${API_KEY}`);
  const data = await res.json();
  return data.results;
}

async function fetchTrendingAnime() {
  let allResults = [];
  // Fetch multiple pages for more anime
  for (let page = 1; page <= 3; page++) {
    const res = await fetch(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}&page=${page}`);
    const data = await res.json();
    const filtered = data.results.filter(item =>
      item.original_language === 'ja' && item.genre_ids.includes(16)
    );
    allResults = allResults.concat(filtered);
  }
  return allResults;
}

function displayBanner(item) {
  document.getElementById('banner').style.backgroundImage = `url(${IMG_URL}${item.backdrop_path})`;
  document.getElementById('banner-title').textContent = item.title || item.name;
}

// NEW: Display a batch of items and add "Show More" button if needed
function displayListBatch(items, containerId, shownCount, totalCount, sectionType) {
  const container = document.getElementById(containerId);
  const start = shownCount;
  const end = Math.min(start + ITEMS_PER_LOAD, totalCount);

  for (let i = start; i < end; i++) {
    const item = items[i];
    const img = document.createElement('img');
    img.src = `${IMG_URL}${item.poster_path}`;
    img.alt = item.title || item.name;
    img.onclick = () => showDetails(item);
    img.loading = 'lazy';
    container.appendChild(img);
  }

  // Update shown count globally
  if (sectionType === 'movie') shownMovies = end;
  else if (sectionType === 'tv') shownTV = end;
  else if (sectionType === 'anime') shownAnime = end;

  // Add or update "Show More" button
  updateShowMoreButton(containerId, sectionType, end < totalCount);
}

// Add or update "Show More" button
function updateShowMoreButton(containerId, sectionType, hasMore) {
  const container = document.getElementById(containerId);

  // Remove existing button
  const existingBtn = container.querySelector('.show-more-btn');
  if (existingBtn) existingBtn.remove();

  if (hasMore) {
    const btn = document.createElement('button');
    btn.className = 'show-more-btn';
    btn.textContent = 'Show More Videos';
    btn.onclick = () => {
      if (sectionType === 'movie') {
        displayListBatch(allMovies, containerId, shownMovies, allMovies.length, 'movie');
      } else if (sectionType === 'tv') {
        displayListBatch(allTVShows, containerId, shownTV, allTVShows.length, 'tv');
      } else if (sectionType === 'anime') {
        displayListBatch(allAnime, containerId, shownAnime, allAnime.length, 'anime');
      }
    };
    container.appendChild(btn);
  }
}

function showDetails(item) {
  currentItem = item;
  document.getElementById('modal-title').textContent = item.title || item.name;
  document.getElementById('modal-description').textContent = item.overview;
  document.getElementById('modal-image').src = `${IMG_URL}${item.poster_path}`;
  document.getElementById('modal-rating').innerHTML = '★'.repeat(Math.round(item.vote_average / 2));
  changeServer();
  document.getElementById('modal').style.display = 'flex';
}

function changeServer() {
  if (!currentItem) return;
  const server = document.getElementById('server').value;
  const type = currentItem.media_type === "movie" ? "movie" : "tv";
  let embedURL = "";

  if (server === "vidsrc.cc") {
    embedURL = `https://vidsrc.cc/v2/embed/${type}/${currentItem.id}`;
  } else if (server === "vidsrc.me") {
    embedURL = `https://vidsrc.net/embed/${type}/?tmdb=${currentItem.id}`;
  } else if (server === "player.videasy.net") {
    embedURL = `https://player.videasy.net/${type}/${currentItem.id}`;
  }

  document.getElementById('modal-video').src = embedURL;
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
  document.getElementById('modal-video').src = '';
}

function openSearchModal() {
  document.getElementById('search-modal').style.display = 'flex';
  document.getElementById('search-input').focus();
}

function closeSearchModal() {
  document.getElementById('search-modal').style.display = 'none';
  document.getElementById('search-results').innerHTML = '';
}

async function searchTMDB() {
  const query = document.getElementById('search-input').value;
  if (!query.trim()) {
    document.getElementById('search-results').innerHTML = '';
    return;
  }

  const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${query}`);
  const data = await res.json();

  const container = document.getElementById('search-results');
  container.innerHTML = '';
  data.results.forEach(item => {
    if (!item.poster_path) return;
    const img = document.createElement('img');
    img.src = `${IMG_URL}${item.poster_path}`;
    img.alt = item.title || item.name;
    img.onclick = () => {
      closeSearchModal();
      showDetails(item);
    };
    container.appendChild(img);
  });
}

// NEW: Initialize with first batch only
async function init() {
  allMovies = await fetchTrending('movie');
  allTVShows = await fetchTrending('tv');
  allAnime = await fetchTrendingAnime();

  // Display banner from movies
  displayBanner(allMovies[Math.floor(Math.random() * allMovies.length)]);

  // Display first batch + button
  displayListBatch(allMovies, 'movies-list', 0, allMovies.length, 'movie');
  displayListBatch(allTVShows, 'tvshows-list', 0, allTVShows.length, 'tv');
  displayListBatch(allAnime, 'anime-list', 0, allAnime.length, 'anime');
}

init();
*/

const API_KEY = 'dfd8d0c0e19038ba3059fc9043e64c68'; // Valid TMDB key
const BASE_URL = 'https://api.themoviedb.org/3'; // REMOVED TRAILING SPACES
const IMG_URL = 'https://image.tmdb.org/t/p/original'; // REMOVED TRAILING SPACES
let currentItem;

// Store full lists
let allMovies = [];
let allTVShows = [];
let allAnime = [];

// Track how many are shown
let shownMovies = 0;
let shownTV = 0;
let shownAnime = 0;

const ITEMS_PER_LOAD = 12; // Show 12 at a time

async function fetchTrending(type) {
  const res = await fetch(`${BASE_URL}/trending/${type}/week?api_key=${API_KEY}`);
  const data = await res.json();
  return data.results;
}

async function fetchTrendingAnime() {
  let allResults = [];
  for (let page = 1; page <= 3; page++) {
    const res = await fetch(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}&page=${page}`);
    const data = await res.json();
    const filtered = data.results.filter(item =>
      item.original_language === 'ja' && item.genre_ids.includes(16)
    );
    allResults = allResults.concat(filtered);
  }
  return allResults;
}

function displayBanner(item) {
  if (item.backdrop_path) {
    document.getElementById('banner').style.backgroundImage = `url(${IMG_URL}${item.backdrop_path})`;
  }
  document.getElementById('banner-title').textContent = item.title || item.name;
}

function displayListBatch(items, containerId, shownCount, totalCount, sectionType) {
  const container = document.getElementById(containerId);
  const start = shownCount;
  const end = Math.min(start + ITEMS_PER_LOAD, totalCount);

  for (let i = start; i < end; i++) {
    const item = items[i];
    if (!item.poster_path) continue; // Skip items without posters
    
    const img = document.createElement('img');
    img.src = `${IMG_URL}${item.poster_path}`;
    img.alt = item.title || item.name;
    img.onclick = () => showDetails(item);
    img.loading = 'lazy';
    img.onerror = () => img.style.display = 'none'; // Hide broken images
    container.appendChild(img);
  }

  // Update shown count
  if (sectionType === 'movie') shownMovies = end;
  else if (sectionType === 'tv') shownTV = end;
  else if (sectionType === 'anime') shownAnime = end;

  updateShowMoreButton(containerId, sectionType, end < totalCount);
}

function updateShowMoreButton(containerId, sectionType, hasMore) {
  const container = document.getElementById(containerId);
  
  // Remove existing button
  const existingBtn = container.querySelector('.show-more-btn');
  if (existingBtn) existingBtn.remove();

  if (hasMore) {
    const btn = document.createElement('button');
    btn.className = 'show-more-btn';
    btn.textContent = 'Show More Videos';
    btn.onclick = () => {
      if (sectionType === 'movie') {
        displayListBatch(allMovies, containerId, shownMovies, allMovies.length, 'movie');
      } else if (sectionType === 'tv') {
        displayListBatch(allTVShows, containerId, shownTV, allTVShows.length, 'tv');
      } else if (sectionType === 'anime') {
        displayListBatch(allAnime, containerId, shownAnime, allAnime.length, 'anime');
      }
    };
    container.appendChild(btn);
  }
}

function showDetails(item) {
  currentItem = item;
  document.getElementById('modal-title').textContent = item.title || item.name;
  document.getElementById('modal-description').textContent = item.overview || 'No description available.';
  document.getElementById('modal-image').src = `${IMG_URL}${item.poster_path}`;
  // Calculate stars safely
  const rating = item.vote_average ? Math.round(item.vote_average / 2) : 0;
  document.getElementById('modal-rating').innerHTML = '★'.repeat(rating) + '☆'.repeat(5 - rating);
  changeServer();
  document.getElementById('modal').style.display = 'flex';
}

function changeServer() {
  if (!currentItem) return;
  const server = document.getElementById('server').value;
  const type = currentItem.media_type === "movie" ? "movie" : "tv";
  let embedURL = "";

  if (server === "vidsrc.cc") {
    embedURL = `https://vidsrc.cc/v2/embed/${type}/${currentItem.id}`; // FIXED URL FORMAT
  } else if (server === "vidsrc.me") {
    embedURL = `https://vidsrc.net/embed/${currentItem.id}?type=${type}`; // FIXED URL FORMAT
  } else if (server === "player.videasy.net") {
    embedURL = `https://player.videasy.net/embed/${type}/${currentItem.id}`; // FIXED URL FORMAT
  }

  document.getElementById('modal-video').src = embedURL;
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
  document.getElementById('modal-video').src = '';
}

function openSearchModal() {
  document.getElementById('search-modal').style.display = 'flex';
  document.getElementById('search-input').focus();
}

function closeSearchModal() {
  document.getElementById('search-modal').style.display = 'none';
  document.getElementById('search-results').innerHTML = '';
}

async function searchTMDB() {
  const query = document.getElementById('search-input').value.trim();
  if (!query) {
    document.getElementById('search-results').innerHTML = '';
    return;
  }

  const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
  const data = await res.json();

  const container = document.getElementById('search-results');
  container.innerHTML = '';
  
  if (data.results && data.results.length > 0) {
    data.results.slice(0, 20).forEach(item => { // Limit results
      if (!item.poster_path || !item.id) return;
      
      const img = document.createElement('img');
      img.src = `${IMG_URL}${item.poster_path}`;
      img.alt = item.title || item.name || item.original_title || item.original_name;
      img.onclick = () => {
        closeSearchModal();
        showDetails({
          ...item,
          media_type: item.media_type || (item.title ? 'movie' : 'tv')
        });
      };
      img.onerror = () => img.parentElement.removeChild(img);
      container.appendChild(img);
    });
  } else {
    container.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#aaa">No results found</p>';
  }
}

async function init() {
  try {
    // Fetch content in parallel
    const [moviesData, tvData, animeData] = await Promise.all([
      fetchTrending('movie'),
      fetchTrending('tv'),
      fetchTrendingAnime()
    ]);
    
    allMovies = moviesData;
    allTVShows = tvData;
    allAnime = animeData;

    // Display banner (use first movie that has a backdrop)
    const validBannerMovie = allMovies.find(m => m.backdrop_path);
    if (validBannerMovie) displayBanner(validBannerMovie);

    // Display first batch + buttons
    displayListBatch(allMovies, 'movies-list', 0, allMovies.length, 'movie');
    displayListBatch(allTVShows, 'tvshows-list', 0, allTVShows.length, 'tv');
    displayListBatch(allAnime, 'anime-list', 0, allAnime.length, 'anime');
  } catch (error) {
    console.error('Initialization failed:', error);
    // Fallback content if API fails
    document.querySelectorAll('.list').forEach(container => {
      container.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#ff4b2b">Failed to load content. Please refresh.</p>';
    });
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
