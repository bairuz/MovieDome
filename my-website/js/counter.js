class SimpleCounter {
  constructor() {
    this.storageKey = 'site_counter_data';
    this.init();
    this.scheduleMidnightReset();
  }

  init() {
    const data = this.loadCounts();
    this.displayCounts(data);
    this.recordVisit();
  }

  loadCounts() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading counter data:', e);
    }
    
    return this.getDefaultData();
  }

  getDefaultData() {
    const today = this.getTodayDate();
    const yesterday = this.getYesterdayDate();
    const lastMonth = this.getLastMonth();
    
    return {
      today: { count: 0, date: today },
      yesterday: { count: 0, date: yesterday },
      lastMonth: { count: 0, month: lastMonth },
      total: 0
    };
  }

  saveCounts(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving counter data:', e);
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
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-11
    return `${year}-${String(month + 1).padStart(2, '0')}`;
  }

  recordVisit() {
    const data = this.loadCounts();
    const today = this.getTodayDate();
    const currentMonth = this.getLastMonth();
    
    // Reset if new day
    if (data.today.date !== today) {
      data.yesterday = { count: data.today.count, date: data.today.date };
      data.today = { count: 1, date: today };
    } else {
      data.today.count += 1;
    }
    
    // Reset if new month
    if (data.lastMonth.month !== currentMonth) {
      data.lastMonth = { count: 1, month: currentMonth };
    } else {
      data.lastMonth.count += 1;
    }
    
    // Update total
    data.total += 1;
    
    this.saveCounts(data);
    this.displayCounts(data);
  }

  displayCounts(data) {
    this.animateCounter('today-count', data.today.count);
    this.animateCounter('yesterday-count', data.yesterday.count);
    this.animateCounter('last-month-count', data.lastMonth.count);
    this.animateCounter('total-count', data.total);
  }

  animateCounter(elementId, targetValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const currentValue = parseInt(element.textContent.replace(/,/g, '')) || 0;
    if (currentValue === targetValue) return;
    
    let start = currentValue;
    const increment = targetValue > currentValue ? 1 : -1;
    const step = Math.max(1, Math.abs(targetValue - currentValue) / 20);
    const duration = 300;
    const steps = Math.abs(targetValue - currentValue) / step;
    const timePerStep = duration / steps;
    
    const updateCounter = () => {
      start += increment * step;
      if ((increment > 0 && start >= targetValue) || (increment < 0 && start <= targetValue)) {
        element.textContent = targetValue.toLocaleString();
        return;
      }
      
      element.textContent = Math.round(start).toLocaleString();
      setTimeout(updateCounter, timePerStep);
    };
    
    updateCounter();
  }

  scheduleMidnightReset() {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const timeUntilMidnight = midnight.getTime() - now.getTime();
    
    setTimeout(() => {
      this.recordVisit();
      this.scheduleMidnightReset();
    }, timeUntilMidnight);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new SimpleCounter();
});
