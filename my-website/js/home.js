  /*  const API_KEY = 'dfd8d0c0e19038ba3059fc9043e64c68';
    const BASE_URL = 'https://api.themoviedb.org/3';
    const IMG_URL = 'https://image.tmdb.org/t/p/original';
    let currentItem;

    async function fetchTrending(type) {
      const res = await fetch(`${BASE_URL}/trending/${type}/week?api_key=${API_KEY}`);
      const data = await res.json();
      return data.results;
    }

    async function fetchTrendingAnime() {
  let allResults = [];

  // Fetch from multiple pages to get more anime (max 3 pages for demo)
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

    function displayList(items, containerId) {
      const container = document.getElementById(containerId);
      container.innerHTML = '';
      items.forEach(item => {
        const img = document.createElement('img');
        img.src = `${IMG_URL}${item.poster_path}`;
        img.alt = item.title || item.name;
        img.onclick = () => showDetails(item);
        container.appendChild(img);
      });
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

    async function init() {
      const movies = await fetchTrending('movie');
      const tvShows = await fetchTrending('tv');
      const anime = await fetchTrendingAnime();

      displayBanner(movies[Math.floor(Math.random() * movies.length)]);
      displayList(movies, 'movies-list');
      displayList(tvShows, 'tvshows-list');
      displayList(anime, 'anime-list');
    }


    init();
    */

const API_KEY = 'dfd8d0c0e19038ba3059fc9043e64c68';
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








//New Features
// Global variables for episode management
let currentSeason = 1;
let currentEpisode = 1;
let seasonEpisodes = [];
let nextEpisodeData = null;
let countdownInterval = null;
let showDetailsData = null; // Store full show details

// Fetch specific episode details with proper error handling
async function fetchEpisodeDetails(showId, seasonNumber, episodeNumber) {
  try {
    console.log(`Fetching episode details for show ${showId}, season ${seasonNumber}, episode ${episodeNumber}`);
    
    const res = await fetch(`${BASE_URL}/tv/${showId}/season/${seasonNumber}/episode/${episodeNumber}?api_key=${API_KEY}&language=en-US`);
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      console.error('TMDB API Error:', {
        status: res.status,
        statusText: res.statusText,
        errorData: errorData
      });
      
      throw new Error(`TMDB API Error ${res.status}: ${res.statusText}`);
    }
    
    const data = await res.json();
    console.log('Episode details loaded successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to fetch episode details:', error);
    
    // Return fallback data instead of failing completely
    return {
      name: `Episode ${episodeNumber}`,
      overview: 'Episode description not available.',
      still_path: null,
      air_date: null
    };
  }
}

// Fetch TV show details with proper error handling
async function fetchTVShowDetails(showId) {
  try {
    console.log(`Fetching TV show details for ID: ${showId}`);
    
    const res = await fetch(`${BASE_URL}/tv/${showId}?api_key=${API_KEY}&append_to_response=seasons,credits&language=en-US`);
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      console.error('TMDB API Error:', {
        status: res.status,
        statusText: res.statusText,
        errorData: errorData
      });
      
      throw new Error(`TMDB API Error ${res.status}: ${res.statusText}`);
    }
    
    const data = await res.json();
    console.log('TV show details loaded successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to fetch TV show details:', error);
    throw error; // Re-throw for the caller to handle
  }
};
  
  // Store current item
  currentItem = item;
  
  // Show loading state
  document.getElementById('episodes-popup').style.display = 'flex';
  document.getElementById('episodes-grid').innerHTML = '<div class="loading">Loading episodes...</div>';
  
  try {
    // Get full show details with seasons
    const showDetails = await fetchTVShowDetails(item.id);
    showDetailsData = showDetails;
    
    // Set popup title
    document.getElementById('popup-series-title').textContent = showDetails.name || showDetails.title;
    
    // Setup season selector
    setupSeasonSelector(showDetails.seasons);
    
    // Load episodes for first season
    if (showDetails.seasons.length > 0) {
      const firstSeason = showDetails.seasons.find(s => s.season_number > 0) || showDetails.seasons[0];
      if (firstSeason) {
        currentSeason = firstSeason.season_number;
        await loadSeasonEpisodes(currentSeason);
      }
    }
  } catch (error) {
    console.error('Error loading episodes:', error);
    document.getElementById('episodes-grid').innerHTML = `
      <p class="error-message">Failed to load episodes. Please try again later.</p>
    `;
  }
}

// Fetch full TV show details
async function fetchTVShowDetails(showId) {
  const res = await fetch(`${BASE_URL}/tv/${showId}?api_key=${API_KEY}&append_to_response=seasons`);
  return await res.json();
}

// Setup season selector dropdown
function setupSeasonSelector(seasons) {
  const seasonSelect = document.getElementById('popup-season-select');
  seasonSelect.innerHTML = '';
  
  // Filter and sort seasons (exclude season 0 - specials)
  const validSeasons = seasons
    .filter(season => season.season_number > 0)
    .sort((a, b) => a.season_number - b.season_number);
  
  validSeasons.forEach(season => {
    const option = document.createElement('option');
    option.value = season.season_number;
    option.textContent = `Season ${season.season_number} (${season.episode_count} Episodes)`;
    seasonSelect.appendChild(option);
  });
  
  // Add event listener
  seasonSelect.addEventListener('change', async function() {
    currentSeason = parseInt(this.value);
    await loadSeasonEpisodes(currentSeason);
  });
}

// Load episodes for a specific season
async function loadSeasonEpisodes(seasonNumber) {
  const episodesGrid = document.getElementById('episodes-grid');
  episodesGrid.innerHTML = '<div class="loading">Loading episodes...</div>';
  
  try {
    const res = await fetch(`${BASE_URL}/tv/${currentItem.id}/season/${seasonNumber}?api_key=${API_KEY}`);
    const seasonData = await res.json();
    seasonEpisodes = seasonData.episodes;
    
    displayEpisodes(seasonEpisodes);
  } catch (error) {
    console.error('Error loading season episodes:', error);
    episodesGrid.innerHTML = `
      <p class="error-message">Failed to load episodes for this season. Please try again.</p>
    `;
  }
}

// Display episodes in the popup grid
function displayEpisodes(episodes) {
  const episodesGrid = document.getElementById('episodes-grid');
  episodesGrid.innerHTML = '';
  
  if (episodes.length === 0) {
    episodesGrid.innerHTML = '<p class="no-episodes">No episodes available for this season.</p>';
    return;
  }
  
  episodes.forEach(episode => {
    const episodeCard = document.createElement('div');
    episodeCard.className = 'episode-card';
    if (currentEpisode === episode.episode_number && currentSeason === seasonEpisodes[0]?.season_number) {
      episodeCard.classList.add('current');
    }
    
    // Format air date
    let airDate = 'Not aired yet';
    if (episode.air_date) {
      const date = new Date(episode.air_date);
      airDate = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
    
    episodeCard.innerHTML = `
      <div class="episode-number">Episode ${episode.episode_number}</div>
      <div class="episode-title">${episode.name}</div>
      <div class="episode-airdate">${airDate}</div>
    `;
    
    episodeCard.addEventListener('click', () => {
      selectEpisode(episode);
    });
    
    episodesGrid.appendChild(episodeCard);
  });
}

// Select an episode from the popup
function selectEpisode(episode) {
  currentEpisode = episode.episode_number;
  
  // Close popup
  closeEpisodesPopup();
  
  // Show details modal with selected episode
  showDetailsWithEpisode(currentItem, currentSeason, currentEpisode);
}

// Show details modal with specific episode
async function showDetailsWithEpisode(item, season, episodeNum) {
  currentItem = item;
  currentSeason = season;
  currentEpisode = episodeNum;
  
  try {
    // Get episode details
    const episodeDetails = await fetchEpisodeDetails(item.id, season, episodeNum);
    
    // Update modal content
    document.getElementById('modal-title').textContent = `${item.name} - S${season}E${episodeNum}: ${episodeDetails.name}`;
    document.getElementById('modal-description').textContent = episodeDetails.overview || item.overview;
    document.getElementById('modal-image').src = episodeDetails.still_path ? 
      `${IMG_URL}${episodeDetails.still_path}` : 
      `${IMG_URL}${item.poster_path}`;
    document.getElementById('modal-rating').innerHTML = '★'.repeat(Math.round(item.vote_average / 2));
    
    // Show the "View All Episodes" button
    document.getElementById('open-episodes-btn').style.display = 'block';
    
    // Load video player
    changeServerForEpisode();
    
    // Check for next episode
    checkNextEpisode();
    
    // Show modal
    document.getElementById('modal').style.display = 'flex';
  } catch (error) {
    console.error('Error loading episode details:', error);
    alert('Failed to load episode details. Please try again.');
  }
}

// Fetch specific episode details
async function fetchEpisodeDetails(showId, seasonNumber, episodeNumber) {
  const res = await fetch(`${BASE_URL}/tv/${showId}/season/${seasonNumber}/episode/${episodeNumber}?api_key=${API_KEY}`);
  return await res.json();
}

/*
// Enhanced changeServer function that handles episodes
function changeServerForEpisode() {
  if (!currentItem) return;
  
  const server = document.getElementById('server').value;
  let embedURL = "";
  
  if (currentItem.media_type === "tv") {
    // TV Show with specific season/episode
    if (server === "vidsrc.cc") {
      embedURL = `https://vidsrc.cc/v2/embed/tv/${currentItem.id}/${currentSeason}-${currentEpisode}`;
    } else if (server === "vidsrc.me") {
      embedURL = `https://vidsrc.to/embed/tv?tmdb=${currentItem.id}&season=${currentSeason}&episode=${currentEpisode}`;
    } else if (server === "player.videasy.net") {
      embedURL = `https://player.videasy.net/embed/tv/${currentItem.id}/${currentSeason}/${currentEpisode}`;
    }
  } else {
    // Movie
    if (server === "vidsrc.cc") {
      embedURL = `https://vidsrc.cc/v2/embed/movie/${currentItem.id}`;
    } else if (server === "vidsrc.me") {
      embedURL = `https://vidsrc.to/embed/movie?tmdb=${currentItem.id}`;
    } else if (server === "player.videasy.net") {
      embedURL = `https://player.videasy.net/embed/movie/${currentItem.id}`;
    }
  }
  
  document.getElementById('modal-video').src = embedURL;
  
  // Start checking for video end (simplified approach)
  setupVideoEndDetection();
}
*/

// Enhanced changeServer function that handles episodes and includes fallbacks
function changeServerForEpisode() {
  if (!currentItem) {
    console.warn('No current item selected');
    return;
  }
  
  const server = document.getElementById('server').value;
  const videoFrame = document.getElementById('modal-video');
  let embedURL = "";
  
  try {
    if (currentItem.media_type === "tv" && currentSeason && currentEpisode) {
      // TV Show with specific season/episode
      if (server === "vidsrc.cc") {
        embedURL = `https://vidsrc.cc/v2/embed/tv/${currentItem.id}/${currentSeason}-${currentEpisode}`;
      } else if (server === "vidsrc.me") {
        embedURL = `https://vidsrc.to/embed/tv?tmdb=${currentItem.id}&season=${currentSeason}&episode=${currentEpisode}`;
      } else if (server === "player.videasy.net") {
        embedURL = `https://player.videasy.net/embed/tv/${currentItem.id}/${currentSeason}/${currentEpisode}`;
      } else {
        // Default fallback
        embedURL = `https://vidsrc.cc/v2/embed/tv/${currentItem.id}/${currentSeason}-${currentEpisode}`;
      }
    } else {
      // Movie
      if (server === "vidsrc.cc") {
        embedURL = `https://vidsrc.cc/v2/embed/movie/${currentItem.id}`;
      } else if (server === "vidsrc.me") {
        embedURL = `https://vidsrc.to/embed/movie?tmdb=${currentItem.id}`;
      } else if (server === "player.videasy.net") {
        embedURL = `https://player.videasy.net/embed/movie/${currentItem.id}`;
      } else {
        // Default fallback
        embedURL = `https://vidsrc.cc/v2/embed/movie/${currentItem.id}`;
      }
    }
    
    console.log('Loading video from URL:', embedURL);
    videoFrame.src = embedURL;
    
    // Add error handling for iframe loading
    videoFrame.onerror = function() {
      console.error('Failed to load video iframe');
      alert('Failed to load video player. Please try a different server.');
    };
    
    // Start checking for video end (simplified approach)
    setupVideoEndDetection();
  } catch (error) {
    console.error('Error in changeServerForEpisode:', error);
    alert('Error configuring video player. Please try again.');
  }
}

// Check if there's a next episode
async function checkNextEpisode() {
  if (!currentItem || currentItem.media_type !== "tv") return;
  
  let nextSeason = currentSeason;
  let nextEpisodeNum = currentEpisode + 1;
  
  // Check if we need to go to next season
  if (nextEpisodeNum > seasonEpisodes.length) {
    nextSeason = currentSeason + 1;
    nextEpisodeNum = 1;
    
    // Check if next season exists in our show details
    const nextSeasonExists = showDetailsData.seasons.some(s => s.season_number === nextSeason);
    if (!nextSeasonExists) {
      nextEpisodeData = null;
      return;
    }
    
    // Get episodes for next season
    try {
      const res = await fetch(`${BASE_URL}/tv/${currentItem.id}/season/${nextSeason}?api_key=${API_KEY}`);
      const seasonData = await res.json();
      seasonEpisodes = seasonData.episodes;
    } catch (error) {
      console.error('Error loading next season:', error);
      nextEpisodeData = null;
      return;
    }
  }
  
  // Get next episode details
  try {
    const nextEpisode = await fetchEpisodeDetails(currentItem.id, nextSeason, nextEpisodeNum);
    nextEpisodeData = {
      season: nextSeason,
      episode: nextEpisodeNum,
      data: nextEpisode
    };
  } catch (error) {
    console.error('Error loading next episode details:', error);
    nextEpisodeData = null;
  }
}

// Setup countdown for next episode
function setupNextEpisodeOverlay() {
  if (!nextEpisodeData) {
    hideNextEpisodeOverlay();
    return;
  }
  
  const overlay = document.getElementById('next-episode-overlay');
  const titleEl = document.getElementById('next-episode-title');
  const descEl = document.getElementById('next-episode-desc');
  const countdownEl = document.getElementById('countdown-timer');
  
  // Update content
  titleEl.textContent = `${nextEpisodeData.data.name} (S${nextEpisodeData.season}E${nextEpisodeData.episode})`;
  descEl.textContent = nextEpisodeData.data.overview 
    ? nextEpisodeData.data.overview.substring(0, 120) + (nextEpisodeData.data.overview.length > 120 ? '...' : '') 
    : 'No description available';
  
  // Reset countdown
  let countdown = 10;
  countdownEl.textContent = countdown;
  
  // Clear any existing interval
  if (countdownInterval) clearInterval(countdownInterval);
  
  // Start new countdown
  countdownInterval = setInterval(() => {
    countdown--;
    countdownEl.textContent = countdown;
    
    if (countdown <= 0) {
      playNextEpisode();
      clearInterval(countdownInterval);
    }
  }, 1000);
  
  // Show overlay with animation
  overlay.style.display = 'block';
  setTimeout(() => {
    overlay.classList.add('visible');
  }, 100);
}

// Hide the next episode overlay
function hideNextEpisodeOverlay() {
  const overlay = document.getElementById('next-episode-overlay');
  overlay.classList.remove('visible');
  
  // Hide after animation completes
  setTimeout(() => {
    overlay.style.display = 'none';
  }, 400);
  
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
}

// Play the next episode
function playNextEpisode() {
  if (!nextEpisodeData) return;
  
  hideNextEpisodeOverlay();
  
  // Update current episode
  currentSeason = nextEpisodeData.season;
  currentEpisode = nextEpisodeData.episode;
  
  // Update modal content
  document.getElementById('modal-title').textContent = 
    `${currentItem.name} - S${currentSeason}E${currentEpisode}: ${nextEpisodeData.data.name}`;
  document.getElementById('modal-description').textContent = nextEpisodeData.data.overview || currentItem.overview;
  
  if (nextEpisodeData.data.still_path) {
    document.getElementById('modal-image').src = `${IMG_URL}${nextEpisodeData.data.still_path}`;
  }
  
  // Load the next episode
  changeServerForEpisode();
  
  // Check for the episode after next
  checkNextEpisode();
}

// Setup video end detection (simplified for iframe players)
function setupVideoEndDetection() {
  // Hide any existing overlay
  hideNextEpisodeOverlay();
  
  // For iframe players, we can only estimate when the video might end
  // This is a fallback approach - 25 minutes for TV episodes, 2 hours for movies
  const duration = currentItem.media_type === "tv" ? 25 * 60 * 1000 : 2 * 60 * 60 * 1000;
  
  setTimeout(() => {
    if (document.getElementById('modal').style.display === 'flex') {
      setupNextEpisodeOverlay();
    }
  }, duration - 10000); // Show 10 seconds before estimated end
}

// Close episodes popup
function closeEpisodesPopup() {
  document.getElementById('episodes-popup').style.display = 'none';
  showDetailsData = null;
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
  // Episodes popup listeners
  document.getElementById('close-episodes-popup').addEventListener('click', closeEpisodesPopup);
  document.getElementById('close-popup-btn').addEventListener('click', closeEpisodesPopup);
  
  // Next episode overlay listeners
  document.getElementById('play-next-btn').addEventListener('click', playNextEpisode);
  document.getElementById('cancel-next-btn').addEventListener('click', hideNextEpisodeOverlay);
  
  // Enhanced showDetails function for TV shows
  const originalShowDetails = window.showDetails;
  window.showDetails = function(item) {
    if (item.media_type === "tv") {
      showAllEpisodes(item);
    } else {
      originalShowDetails(item);
      
      // Hide the episodes button for movies
      document.getElementById('open-episodes-btn').style.display = 'none';
    }
  };
  
  // Update changeServer to use the new function
  document.getElementById('server').addEventListener('change', changeServerForEpisode);
});

// Add this to your existing init function
// Update displayList function to handle TV shows differently
function displayList(items, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  
  items.slice(0, 12).forEach(item => {
    const img = document.createElement('img');
    img.src = `${IMG_URL}${item.poster_path}`;
    img.alt = item.title || item.name;
    
    // For TV shows, show series badge
    if (item.media_type === "tv") {
      const badge = document.createElement('div');
      badge.className = 'series-badge';
      badge.textContent = 'SERIES';
      img.parentElement?.appendChild(badge);
    }
    
    img.onclick = () => showDetails(item);
    container.appendChild(img);
  });
}











