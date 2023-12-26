chrome.runtime.onInstalled.addListener(function() {
  // Set default countdown time
  chrome.storage.sync.set({ countdownTime: 1200 });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'startTimer') {
    chrome.storage.sync.get('countdownTime', function(data) {
      var countdownTime = data.countdownTime || 1200;
      chrome.storage.local.set({ countdownTime: countdownTime, timerRunning: true });
      startCountdown();
    });
  } else if (request.action === 'stopTimer') {
    chrome.storage.local.set({ timerRunning: false });
  }
});

function startCountdown() {
  chrome.storage.local.get('countdownTime', function(data) {
    var countdownTime = data.countdownTime || 1200;
    var timerInterval = setInterval(function() {
      chrome.storage.local.get('timerRunning', function(data) {
        if (data.timerRunning) {
          if (countdownTime > 0) {
            countdownTime--;
          } else {
            clearInterval(timerInterval);
            showNotification();
          }
          chrome.storage.local.set({ countdownTime: countdownTime });
        } else {
          clearInterval(timerInterval);
        }
      });
    }, 1000); // Update every second
  });
}

function showNotification() {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icon128.png', // Adjust the path as needed
    title: 'Rest Your Eyes',
    message: 'ถึงเวลาพักสายตาแล้ว !!'
  });
}
