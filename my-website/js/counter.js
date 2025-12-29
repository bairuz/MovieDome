// Compact Visitor Counter
document.addEventListener('DOMContentLoaded', function() {
  // Check if counter elements exist before initializing
  const counterElements = document.querySelectorAll('.compact-counter .stat-value');
  if (counterElements.length === 0) return;
  
  const yesterdayElement = document.getElementById('yesterday-count');
  const onlineElement = document.getElementById('online-count');
  const monthElement = document.getElementById('month-count');
  const totalElement = document.getElementById('total-count');
  
  // Initial values - in production these would come from your server
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
    if (yesterdayElement) yesterdayElement.textContent = formatNumber(stats.yesterday);
    if (onlineElement) onlineElement.textContent = formatNumber(stats.online);
    if (monthElement) monthElement.textContent = formatNumber(stats.month);
    if (totalElement) totalElement.textContent = formatNumber(stats.total);
  }
  
  // Animate counters on page load
  function animateCounters() {
    if (!yesterdayElement || !onlineElement || !monthElement || !totalElement) return;
    
    // Animate yesterday count
    animateValue(yesterdayElement, 0, stats.yesterday, 800);
    
    // Animate online count
    animateValue(onlineElement, 0, stats.online, 600);
    
    // Animate month count
    animateValue(monthElement, 0, stats.month, 1000);
    
    // Animate total count
    animateValue(totalElement, 0, stats.total, 1200);
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
  
  // Simulate real-time updates
  function simulateRealTimeUpdates() {
    // Only update if elements exist
    if (!onlineElement || !monthElement || !totalElement) return;
    
    // Update online users
    setInterval(() => {
      if (!onlineElement) return;
      const change = Math.floor(Math.random() * 5) - 2;
      stats.online = Math.max(1, stats.online + change);
      onlineElement.textContent = formatNumber(stats.online);
    }, 8000);
    
    // Update visitor counts
    setInterval(() => {
      if (!monthElement || !totalElement) return;
      
      const newVisitors = Math.floor(Math.random() * 3) + 1;
      stats.total += newVisitors;
      stats.month += newVisitors;
      
      if (Math.random() < 0.1 && yesterdayElement) {
        stats.yesterday += newVisitors;
        yesterdayElement.textContent = formatNumber(stats.yesterday);
      }
      
      monthElement.textContent = formatNumber(stats.month);
      totalElement.textContent = formatNumber(stats.total);
    }, 15000);
  }
  
  // Initialize counter if elements exist
  if (yesterdayElement && onlineElement && monthElement && totalElement) {
    updateCounters();
    setTimeout(animateCounters, 300);
    setTimeout(simulateRealTimeUpdates, 2000);
  }
});
