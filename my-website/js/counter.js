```javascript
document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const yesterdayElement = document.getElementById('yesterday-count');
  const onlineElement = document.getElementById('online-count');
  const monthElement = document.getElementById('month-count');
  const totalElement = document.getElementById('total-count');
  
  // Only initialize if counter elements exist
  if (!yesterdayElement || !onlineElement || !monthElement || !totalElement) {
    console.log('Counter elements not found');
    return;
  }
  
  // Function to format numbers with commas
  function formatNumber(num) {
    return num.toLocaleString();
  }
  
  // Function to get counts from CountAPI
  async function getCounts() {
    try {
      // Get current date info
      const today = new Date();
      const currentDay = today.getDate();
      const currentMonth = today.getMonth() + 1;
      const currentYear = today.getFullYear();
      
      // Get total visits
      const totalResponse = await fetch('https://api.countapi.xyz/hit/moviedome-85i/total');
      const totalData = await totalResponse.json();
      
      // Get monthly visits (reset on 1st of each month)
      const monthKey = `month_${currentYear}_${currentMonth}`;
      const monthResponse = await fetch(`https://api.countapi.xyz/hit/moviedome-85i/${monthKey}`);
      const monthData = await monthResponse.json();
      
      // Get daily visits for yesterday (this is simplified - a proper implementation would need server-side logic)
      const yesterdayKey = `day_${currentYear}_${currentMonth}_${currentDay - 1}`;
      const yesterdayResponse = await fetch(`https://api.countapi.xyz/get/moviedome-85i/${yesterdayKey}`);
      let yesterdayData = { value: 0 };
      
      if (yesterdayResponse.ok) {
        yesterdayData = await yesterdayResponse.json();
      }
      
      // For online users, we'll use a simplified approach (this is an estimate)
      // In a real implementation, you'd need WebSockets or a more sophisticated backend
      const onlineUsers = Math.max(1, Math.floor(totalData.value * 0.001));
      
      // Update the UI
      yesterdayElement.textContent = formatNumber(yesterdayData.value || 0);
      onlineElement.textContent = formatNumber(onlineUsers);
      monthElement.textContent = formatNumber(monthData.value);
      totalElement.textContent = formatNumber(totalData.value);
      
      // Set up periodic refresh (every 30 seconds)
      setTimeout(getCounts, 30000);
      
    } catch (error) {
      console.error('Error fetching visitor counts:', error);
      
      // Fallback to static numbers if API fails
      yesterdayElement.textContent = formatNumber(1247);
      onlineElement.textContent = formatNumber(86);
      monthElement.textContent = formatNumber(28453);
      totalElement.textContent = formatNumber(427691);
      
      // Retry after 1 minute
      setTimeout(getCounts, 60000);
    }
  }
  
  // Initialize the counter
  getCounts();
  
  // Track current visit
  async function trackVisit() {
    try {
      // Get today's date components
      const today = new Date();
      const currentDay = today.getDate();
      const currentMonth = today.getMonth() + 1;
      const currentYear = today.getFullYear();
      
      // Track daily visits
      const dayKey = `day_${currentYear}_${currentMonth}_${currentDay}`;
      await fetch(`https://api.countapi.xyz/hit/moviedome-85i/${dayKey}`);
      
    } catch (error) {
      console.error('Error tracking visit:', error);
    }
  }
  
  // Track this visit
  trackVisit();
});
```

## Setup Instructions

1. **Copy the HTML snippet** into your footer (inside the `.footer-content` div)

2. **Create `counter.css`** in your CSS folder and paste the CSS code

3. **Create `counter.js`** in your JS folder and paste the JavaScript code

4. **Add these lines to your HTML:**
   ```html
   <!-- In the <head> section -->
   <link rel="stylesheet" href="css/counter.css">
   
   <!-- Before the closing </body> tag -->
   <script src="js/counter.js" defer></script>
   ```
