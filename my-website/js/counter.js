```javascript
document.addEventListener('DOMContentLoaded', () => {
  // DOM elements
  const yesterdayElement = document.getElementById('yesterday-count');
  const onlineElement = document.getElementById('online-count');
  const monthElement = document.getElementById('month-count');
  const totalElement = document.getElementById('total-count');
  
  // Initial values
  let stats = {
    yesterday: 1247,
    online: 86,
    month: 28453,
    total: 427691
  };
  
  // Format numbers with commas
  function formatNumber(num) {
    return num.toLocaleString();
  }
  
  // Update counter display
  function updateCounters() {
    yesterdayElement.textContent = formatNumber(stats.yesterday);
    onlineElement.textContent = formatNumber(stats.online);
    monthElement.textContent = formatNumber(stats.month);
    totalElement.textContent = formatNumber(stats.total);
  }
  
  // Animate counters on page load
  function animateCounters() {
    // Animate yesterday count
    animateValue(yesterdayElement, 0, stats.yesterday, 1000);
    
    // Animate online count
    animateValue(onlineElement, 0, stats.online, 800);
    
    // Animate month count
    animateValue(monthElement, 0, stats.month, 1200);
    
    // Animate total count
    animateValue(totalElement, 0, stats.total, 1500);
  }
  
  // Generic counter animation function
  function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const value = Math.floor(progress * (end - start) + start);
      element.textContent = formatNumber(value);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }
  
  // Simulate real-time updates (optional)
  function simulateRealTimeUpdates() {
    // Update online users every few seconds
    setInterval(() => {
      const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
      stats.online = Math.max(1, stats.online + change);
      onlineElement.textContent = formatNumber(stats.online);
    }, 5000);
    
    // Simulate new visitors
    setInterval(() => {
      const newVisitors = Math.floor(Math.random() * 3) + 1;
      stats.total += newVisitors;
      stats.month += newVisitors;
      
      // 10% chance to increase yesterday count
      if (Math.random() < 0.1) {
        stats.yesterday += newVisitors;
        yesterdayElement.textContent = formatNumber(stats.yesterday);
      }
      
      monthElement.textContent = formatNumber(stats.month);
      totalElement.textContent = formatNumber(stats.total);
    }, 10000);
  }
  
  // Initialize
  updateCounters();
  animateCounters();
  simulateRealTimeUpdates();
  
  /* 
  In a real implementation, you would fetch data from your server:
  
  fetch('/api/visitor-stats')
    .then(response => response.json())
    .then(data => {
      stats = {
        yesterday: data.yesterday,
        online: data.online,
        month: data.month,
        total: data.total
      };
      animateCounters();
    })
    .catch(error => {
      console.error('Error fetching visitor stats:', error);
      animateCounters();
    });
  */
});
```
