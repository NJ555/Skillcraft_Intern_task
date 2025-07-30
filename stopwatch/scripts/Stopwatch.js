// DOM Elements
const digitalToggle = document.getElementById('digital-toggle');
const analogToggle = document.getElementById('analog-toggle');
const digitalWatch = document.getElementById('digital-watch');
const analogWatch = document.getElementById('analog-watch');
const display = document.getElementById('display');
const analogDisplay = document.querySelector('.analog-display');
const milliseconds = document.querySelector('.milliseconds');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const lapBtn = document.getElementById('lap-btn');
const lapsContainer = document.getElementById('laps');
const hourHand = document.querySelector('.hour-hand');
const minuteHand = document.querySelector('.minute-hand');
const secondHand = document.querySelector('.second-hand');

// Stopwatch variables
let startTime = 0;
let elapsedTime = 0;
let timerInterval;
let isRunning = false;
let lapCount = 1;
let pausedTime = 0;

// Toggle between digital and analog modes
digitalToggle.addEventListener('click', () => {
  digitalWatch.classList.add('active');
  analogWatch.classList.remove('active');
  digitalToggle.classList.add('active');
  analogToggle.classList.remove('active');
});

analogToggle.addEventListener('click', () => {
  analogWatch.classList.add('active');
  digitalWatch.classList.remove('active');
  analogToggle.classList.add('active');
  digitalToggle.classList.remove('active');
});

// Format time for display
function formatTime(time) {
  const hours = Math.floor(time / 3600000);
  const minutes = Math.floor((time % 3600000) / 60000);
  const seconds = Math.floor((time % 60000) / 1000);
  const ms = Math.floor((time % 1000) / 10);
  
  return {
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0'),
    ms: ms.toString().padStart(2, '0')
  };
}

// Update the analog clock hands
function updateAnalogClock(time) {
  // Convert milliseconds to seconds, minutes, and hours
  const totalSeconds = time / 1000;
  const seconds = totalSeconds % 60;
  const totalMinutes = totalSeconds / 60;
  const minutes = totalMinutes % 60;
  const hours = (totalMinutes / 60) % 12;
  
  // Calculate rotation degrees
  const secondRotation = seconds * 6; // 360° / 60 = 6° per second
  const minuteRotation = minutes * 6; // 6° per minute
  const hourRotation = (hours * 30) + (minutes * 0.5); // 30° per hour + 0.5° per minute
  
  // Apply rotations
  secondHand.style.transform = `translate(-50%, -100%) rotate(${secondRotation}deg)`;
  minuteHand.style.transform = `translate(-50%, -100%) rotate(${minuteRotation}deg)`;
  hourHand.style.transform = `translate(-50%, -100%) rotate(${hourRotation}deg)`;
}

// Update the stopwatch display
function updateDisplay() {
  const currentTime = elapsedTime + (Date.now() - startTime);
  const time = formatTime(currentTime);
  
  // Update digital display
  display.textContent = `${time.hours}:${time.minutes}:${time.seconds}`;
  milliseconds.textContent = time.ms;
  
  // Update analog display
  analogDisplay.textContent = `${time.hours}:${time.minutes}:${time.seconds}`;
  
  // Update analog clock
  updateAnalogClock(currentTime);
}

// Start the stopwatch
function start() {
  if (!isRunning) {
    // If we're resuming from pause, use the paused time
    if (pausedTime > 0) {
      startTime = Date.now() - pausedTime;
      pausedTime = 0;
    } else {
      startTime = Date.now();
    }
    
    timerInterval = setInterval(updateDisplay, 10);
    isRunning = true;
    
    // Update button states
    startBtn.disabled = true;
    pauseBtn.disabled = false;
  }
}

// Pause the stopwatch
function pause() {
  if (isRunning) {
    clearInterval(timerInterval);
    // Save the current elapsed time
    pausedTime = elapsedTime + (Date.now() - startTime);
    isRunning = false;
    
    // Update button states
    startBtn.disabled = false;
    pauseBtn.disabled = true;
  }
}

// Reset the stopwatch
function reset() {
  clearInterval(timerInterval);
  startTime = 0;
  elapsedTime = 0;
  pausedTime = 0;
  isRunning = false;
  lapCount = 1;
  
  // Reset displays
  display.textContent = '00:00:00';
  analogDisplay.textContent = '00:00:00';
  milliseconds.textContent = '00';
  
  // Reset analog clock hands
  secondHand.style.transform = 'translate(-50%, -100%) rotate(0deg)';
  minuteHand.style.transform = 'translate(-50%, -100%) rotate(0deg)';
  hourHand.style.transform = 'translate(-50%, -100%) rotate(0deg)';
  
  // Clear laps
  lapsContainer.innerHTML = '';
  
  // Update button states
  startBtn.disabled = false;
  pauseBtn.disabled = true;
}

// Record a lap time
function lap() {
  if (isRunning) {
    const currentTime = elapsedTime + (Date.now() - startTime);
    const time = formatTime(currentTime);
    const lapTime = `${time.hours}:${time.minutes}:${time.seconds}.${time.ms}`;
    
    // Create lap element
    const lapItem = document.createElement('div');
    lapItem.className = 'lap-item';
    lapItem.innerHTML = `
      <span class="lap-number">Lap ${lapCount}</span>
      <span class="lap-time">${lapTime}</span>
    `;
    
    // Add to laps container
    lapsContainer.prepend(lapItem);
    lapCount++;
    
    // Auto-scroll to new lap
    lapsContainer.scrollTop = 0;
  }
}

// Event listeners for buttons
startBtn.addEventListener('click', start);
pauseBtn.addEventListener('click', pause);
resetBtn.addEventListener('click', reset);
lapBtn.addEventListener('click', lap);

// Initialize button states
pauseBtn.disabled = true;