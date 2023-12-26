document.addEventListener('DOMContentLoaded', function() {
 
  var startButton = document.getElementById('startTimer');
  var stopButton = document.getElementById('stopTimer');
  var countdownDisplay = document.getElementById('countdown');
  var durationInput = document.getElementById('durationInput');

  function updateCountdownDisplay() {
    chrome.storage.local.get('countdownTime', function(data) {
      var countdownTime = data.countdownTime || 1200;
      var minutes = Math.floor(countdownTime / 60);
      var seconds = countdownTime % 60;
      countdownDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    });
  }

  function startCountdown() {
    chrome.runtime.sendMessage({ action: 'startTimer' });
  }

  function stopCountdown() {
    chrome.runtime.sendMessage({ action: 'stopTimer' });
    updateCountdownDisplay();
  }

  startButton.addEventListener('click', function() {
    startCountdown();
  });

  stopButton.addEventListener('click', function() {
    stopCountdown();
  });

  durationInput.addEventListener('input', function() {
    var duration = parseInt(durationInput.value, 10) || 5;
    chrome.storage.sync.set({ countdownTime: duration * 60 });
    updateCountdownDisplay();
  });

  setInterval(function() {
    updateCountdownDisplay();
  }, 1000);
  
  updateCountdownDisplay();
});
