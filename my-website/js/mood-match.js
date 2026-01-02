document.addEventListener('DOMContentLoaded', () => {
  const moodBtns = document.querySelectorAll('.mood-btn');
  const resultsDiv = document.getElementById('quiz-results');

  if (!moodBtns.length || !resultsDiv) return;

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

  moodBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      moodBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      const mood = this.dataset.mood;
      showRecommendations(mood);
    });
  });

  function showRecommendations(mood) {
    const movies = recommendations[mood];
    let html = `<h3 class="result-title">${getMoodTitle(mood)}</h3>`;
    
    movies.forEach(movie => {
      html += `
        <div class="rec-item">
          <strong>${movie.title}</strong><br>
          (${movie.year}) • ${movie.genre}<br>
          Rating: ${movie.rating}
        </div>`;
    });
    
    html += `<button class="watch-btn">▶️ Watch Trailer</button>`;
    
    resultsDiv.innerHTML = html;
    resultsDiv.style.display = 'grid';
    resultsDiv.scrollIntoView({behavior: 'smooth'});
  }

  function getMoodTitle(mood) {
    return {
      chill: "😌 Cozy Night Picks",
      thrill: "💥 Adrenaline Rush Picks",
      deep: "🧠 Mind-Bending Picks",
      laugh: "😂 Instant Mood Lifters",
      nostalgic: "📼 Throwback Gems"
    }[mood];
  }
});
