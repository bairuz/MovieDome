class ElegantPageCounter {
  constructor() {
    this.storageKey = 'page_counter_data';
    this.init();
    this.startAutoUpdate();
  }

  init() {
    // Check for prefers-color-scheme
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      document.body.classList.add('light-mode');
    }
    
    // Manual theme toggle (optional)
    this.setupThemeToggle();
    
    // Load and display counts
    this.loadCounts();
    this.displayCounts();
    
    // Record current visit
    this.recordVisit();
  }

  setupThemeToggle() {
    // Optional: Add theme toggle button
    const themeToggle = document.createElement('button');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.className = 'theme-toggle';
    themeToggle.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: var(--primary);
      color: white;
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      z-index: 1000;
      display: none;
    `;
    
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      const isLight = document.body.classList.contains('light-mode');
      themeToggle.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
      
      // Save preference
      localStorage.setItem('theme_preference', isLight ? 'light' : 'dark');
    });
    
    // Check saved preference
    const savedTheme = localStorage.getItem('theme_preference');
    if (savedTheme) {
      document.body.classList.toggle('light-mode', savedTheme === 'light');
      themeToggle.innerHTML = savedTheme === 'light' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }
    
    // Only show toggle if user has interacted
    setTimeout(() => {
      document.body.appendChild(themeToggle);
    }, 3000);
  }

  loadCounts() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading counter data:', e);
    }
    
    // Default structure
    return {
      today: { count: 0, date: this.getTodayDate() },
      yesterday: { count: 0, date: this.getYesterdayDate() },
      lastMonth: { count: 0, month: this.getLastMonth() },
      total: 0,
      history: {}
    };
  }

  saveCounts(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving counter data:', e);
      // Fallback to session storage
      sessionStorage.setItem(this.storageKey, JSON.stringify(data));
    }
  }

  getTodayDate() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }

  getYesterdayDate() {
    const now = new Date();
    now.setDate(now.getDate() - 1);
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }

  getLastMonth() {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    return `${year}-${String(month).padStart(2, '0')}`;
  }

  recordVisit() {
    const data = this.loadCounts();
    const today = this.getTodayDate();
    const lastMonth = this.getLastMonth();
    
    // Reset counters if new day/month
    if (data.today.date !== today) {
      data.yesterday = { count: data.today.count, date: data.today.date };
      data.today = { count: 1, date: today };
    } else {
      data.today.count += 1;
    }
    
    // Reset monthly counter if new month
    if (data.lastMonth.month !== lastMonth) {
      data.lastMonth = { count: 1, month: lastMonth };
    } else {
      data.lastMonth.count += 1;
    }
    
    // Update total
    data.total += 1;
    
    // Update history for analytics
    if (!data.history[today]) {
      data.history[today] = 0;
    }
    data.history[today] += 1;
    
    // Clean old history (keep last 90 days)
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    Object.keys(data.history).forEach(date => {
      if (new Date(date) < ninetyDaysAgo) {
        delete data.history[date];
      }
    });
    
    this.saveCounts(data);
    this.displayCounts();
  }

  displayCounts() {
    const data = this.loadCounts();
    
    // Animate counters
    this.animateCounter('today-count', data.today.count);
    this.animateCounter('yesterday-count', data.yesterday.count);
    this.animateCounter('last-month-count', data.lastMonth.count);
    this.animateCounter('total-count', data.total);
  }

  animateCounter(elementId, targetValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const currentValue = parseInt(element.textContent) || 0;
    if (currentValue === targetValue) return;
    
    element.classList.add('count-animate');
    
    let start = currentValue;
    const increment = targetValue > currentValue ? 1 : -1;
    const duration = Math.abs(targetValue - currentValue) * 10;
    const stepTime = duration > 1000 ? 20 : 5;
    
    const timer = setInterval(() => {
      start += increment;
      element.textContent = start.toLocaleString();
      
      if (start === targetValue) {
        clearInterval(timer);
        setTimeout(() => {
          element.classList.remove('count-animate');
        }, 300);
      }
    }, stepTime);
  }

  startAutoUpdate() {
    // Update display every minute
    setInterval(() => {
      this.displayCounts();
    }, 60000);
    
    // Check for new day at midnight
    this.scheduleMidnightReset();
  }

  scheduleMidnightReset() {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const timeUntilMidnight = midnight.getTime() - now.getTime();
    
    setTimeout(() => {
      this.recordVisit(); // Will reset counters if needed
      this.scheduleMidnightReset();
    }, timeUntilMidnight);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Load Font Awesome for icons
  const fontAwesome = document.createElement('link');
  fontAwesome.rel = 'stylesheet';
  fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
  document.head.appendChild(fontAwesome);
  
  // Load counter styles
  const counterCSS = document.createElement('link');
  counterCSS.rel = 'stylesheet';
  counterCSS.href = 'css/counter.css';
  document.head.appendChild(counterCSS);
  
  // Initialize counter after styles load
  fontAwesome.onload = () => {
    new ElegantPageCounter();
  };
});
