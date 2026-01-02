// Mood Match Recommender - Zero Dependencies
document.addEventListener('DOMContentLoaded', () => {
  const quizSection = document.getElementById('mood-quiz');
  if (!quizSection) return; // Exit if section not present

  const moodBtns = document.querySelectorAll('.mood-btn');
  const resultsDiv = document.getElementById('quiz-results');

  // Sample data - replace with your actual movie data later
  const recommendations = {
    chill: [
      { title: "Before Sunrise", year: 1995, genre: "Romance", rating: "97%" },
      { title: "The Secret Life of Walter Mitty", year: 2013, genre: "Adventure", rating: "86%" },
      { title: "My Neighbor Totoro", year: 1988, genre: "Animation", rating: "92%" }
    ],
    thrill: [
      { title: "Mad Max: Fury Road", year: 2015, genre: "Action", rating: "97%" },
      { title: "Top Gun: Maverick", year: 2022, genre: "Action", rating: "96%" },
      { title: "Everything Everywhere All at Once", year: 2022, genre: "Sci-Fi", rating: "94%" }
    ],
    deep: [
      { title: "Arrival", year: 2016, genre: "Sci-Fi", rating: "94%" },
      { title: "Parasite", year: 2019, genre: "Thriller", rating: "99%" },
      { title: "Eternal Sunshine of the Spotless Mind", year: 2004, genre: "Romance", rating: "92%" }
    ],
    laugh: [
      { title: "Superbad", year: 2007, genre: "Comedy", rating: "88%" },
      { title: "What We Do in the Shadows", year: 2014, genre: "Mockumentary", rating: "96%" },
      { title: "The Grand Budapest Hotel", year: 2014, genre: "Comedy", rating: "92%" }
    ],
    nostalgic: [
      { title: "Back to the Future", year: 1985, genre: "Adventure", rating: "96%" },
      { title: "Spirited Away", year: 2001, genre: "Animation", rating: "97%" },
      { title: "Ferris Bueller's Day Off", year: 1986, genre: "Comedy", rating: "87%" }
    ]
  };

  // Attach event listeners
  moodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Reset active states
      moodBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const mood = btn.dataset.mood;
      showRecommendations(mood);
    });
  });

  function showRecommendations(mood) {
    const movies = recommendations[mood];
    let html = `<h3 class="result-title">${getMoodTitle(mood)}</h3>
                <div class="rec-grid">`;
    
    movies.forEach(movie => {
      html += `
        <div class="rec-item">
          <strong>${movie.title}</strong> (${movie.year}) • ${movie.genre} • ${movie.rating}
        </div>`;
    });
    
    html += `
      </div>
      <div class="watch-now">
        <button class="watch-btn" data-trailer="${mood}-trailer">▶️ Watch Trailer</button>
        <button class="save-btn">❤️ Save to Watchlist</button>
      </div>`;

    resultsDiv.innerHTML = html;
    resultsDiv.style.display = 'block';
    
    // Smooth scroll to results
    resultsDiv.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'nearest',
      inline: 'nearest'
    });
    
    // Trailer button handler
    document.querySelector('.watch-btn')?.addEventListener('click', (e) => {
      const trailerKey = e.currentTarget.dataset.trailer;
      alert(`✨ Pro tip: Connect this to YouTube API later!\nExample trailer key: ${trailerKey}`);
    });
  }

  function getMoodTitle(mood) {
    const titles = {
      chill: "😌 Cozy Night Picks",
      thrill: "💥 Adrenaline Rush Picks",
      deep: "🧠 Mind-Bending Picks",
      laugh: "😂 Instant Mood Lifters",
      nostalgic: "📼 Throwback Gems"
    };
    return titles[mood] || "🎬 Your Perfect Match";
  }
});
