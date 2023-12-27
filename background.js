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
            chrome.storage.local.set({ countdownTime: countdownTime });
          } else {
            clearInterval(timerInterval);
            showNotification();
            showPopupAlert();
          }
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
    iconUrl: 'icon128.png',
    title: 'Rest Your Eyes',
    message: 'ถึงเวลาพักสายตาแล้ว !!'
  });
}

function showPopupAlert() {
  const popupWidth = 500;
  const popupHeight = 400;

  chrome.windows.getCurrent(function (currentWindow) {
    const left = Math.round(currentWindow.left + (currentWindow.width - popupWidth) / 2);
    const top = Math.round(currentWindow.top + (currentWindow.height - popupHeight) / 2);

    chrome.windows.create({
      type: "popup",
      url: "alertwindow.html",
      width: popupWidth,
      height: popupHeight,
      left: left,
      top: top
    }, function(window) {
      // Set a timeout to close the popup window after 20 seconds
      setTimeout(function() {
        chrome.windows.remove(window.id);
      }, 20000); // 20 seconds
    });
  });
}

