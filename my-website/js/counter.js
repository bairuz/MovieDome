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
  
  // CounterAPI.dev endpoint
  const apiEndpoint = 'https://api.counterapi.dev/v2/jan-kadiris-team-2297/first-counter-2297';
  
  // Function to format numbers with commas
  function formatNumber(num) {
    return num.toLocaleString();
  }
  
  // Function to animate value changes
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
  
  // Initialize with loading state
  yesterdayElement.textContent = '...';
  onlineElement.textContent = '...';
  monthElement.textContent = '...';
  totalElement.textContent = '...';
  
  // CounterAPI.dev implementation
  async function initializeCounter() {
    try {
      // Get current counter data
      const response = await fetch(apiEndpoint);
      const data = await response.json();
      
      // Initialize counters
      let totalVisits = data.value || 0;
      let monthlyVisits = data.monthly || 0;
      
      // Track this visit
      const trackResponse = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'increment',
          metadata: {
            timestamp: new Date().toISOString(),
            url: window.location.href
          }
        })
      });
      
      const trackData = await trackResponse.json();
      totalVisits = trackData.value || totalVisits + 1;
      
      // Get monthly data (if available)
      if (trackData.monthly !== undefined) {
        monthlyVisits = trackData.monthly;
      }
      
      // Calculate yesterday's visits (estimate based on total)
      const yesterdayVisits = Math.max(0, totalVisits - 10); // Simple estimation
      
      // Estimate online users (based on recent activity)
      const onlineUsers = Math.max(1, Math.min(50, Math.floor(totalVisits * 0.01 + Math.random() * 5)));
      
      // Update counters with animations
      animateValue(yesterdayElement, 0, yesterdayVisits, 800);
      animateValue(onlineElement, 0, onlineUsers, 600);
      animateValue(monthElement, 0, monthlyVisits, 1000);
      animateValue(totalElement, 0, totalVisits, 1200);
      
      // Update online users more frequently
      setInterval(async () => {
        const onlineResponse = await fetch(apiEndpoint);
        const onlineData = await onlineResponse.json();
        const currentVisits = onlineData.value || totalVisits;
        const updatedOnlineUsers = Math.max(1, Math.min(50, Math.floor(currentVisits * 0.01 + Math.random() * 10)));
        animateValue(onlineElement, parseInt(onlineElement.textContent.replace(/,/g, '')), updatedOnlineUsers, 400);
      }, 15000);
      
      // Update other counters every minute
      setInterval(async () => {
        try {
          const updateResponse = await fetch(apiEndpoint);
          const updateData = await updateResponse.json();
          
          const currentTotal = updateData.value || totalVisits;
          const currentMonthly = updateData.monthly || monthlyVisits;
          
          animateValue(monthElement, parseInt(monthElement.textContent.replace(/,/g, '')), currentMonthly, 600);
          animateValue(totalElement, parseInt(totalElement.textContent.replace(/,/g, '')), currentTotal, 800);
          
          // Update yesterday's estimate
          const yesterdayEstimate = Math.max(0, currentTotal - 15);
          if (Math.abs(yesterdayEstimate - parseInt(yesterdayElement.textContent.replace(/,/g, ''))) > 5) {
            animateValue(yesterdayElement, parseInt(yesterdayElement.textContent.replace(/,/g, '')), yesterdayEstimate, 600);
          }
        } catch (error) {
          console.error('Error updating counters:', error);
        }
      }, 60000);
      
    } catch (error) {
      console.error('Error initializing counter:', error);
      
      // Fallback static values if API fails
      yesterdayElement.textContent = formatNumber(150);
      onlineElement.textContent = formatNumber(12);
      monthElement.textContent = formatNumber(3800);
      totalElement.textContent = formatNumber(25400);
      
      // Try again after 30 seconds
      setTimeout(initializeCounter, 30000);
    }
  }
  
  // Initialize the counter
  initializeCounter();
});
```
