/**
 * Jesulin Raj S - Pastel Birthday Celebration Script
 * Features: Interactive Candles, Canvas Confetti, Web Audio Ambient Chimes,
 * Image Switcher, Scripture Tabs, In-page Personalization Modal with localStorage
 */

// Default Configuration & Personalized Content
const DEFAULT_CONFIG = {
  fullName: "Jesulin Raj S",
  shortName: "Jes",
  subtitle: "A special day for someone wonderfully unique.",
  heroQuote: "Today is all about celebrating you.",
  aboutHeading: "The One and Only Jesulin!",
  cinemaTagline: "Now Showing: Jesulin Raj S - The Blockbuster Edition 🍿🎬",
  letter: `Heyyy Dude! Happy Birthday!

Well, it's your special day! I just wanted to take a moment to remind you how special you are and how much I appreciate having you as my friend.

I hope this new chapter brings you beautiful opportunities, unforgettable memories, and countless reasons to smile.

Keep being the person you are. Never stop dreaming, growing, laughing, and becoming the person God has called you to be.

I pray that God leads you in every decision, strengthens you through every challenge, and fills your life with His peace and joy.

Have the happiest birthday! Stay blessed!`,
  blessingPrayer: "Jesulin, my prayer for you is that the Lord will bless you and keep you wherever you go. May His presence guide every step you take, His light shine upon your path, and His peace remain with you in every season of life. May this new year of your life be filled with His goodness and countless blessings.",
  jeremiahPrayer: "On your birthday, I pray that you continue to trust in God's plans for your life. Even when the path ahead seems uncertain, remember that He knows you, He goes before you, and His plans are greater than anything you can imagine. May this promise encourage you throughout every season of your life."
};

// State
let config = { ...DEFAULT_CONFIG };
let wishCount = 0;
let audioPlaying = false;
let audioCtx = null;
let melodyInterval = null;

// Pastel Confetti Color Palette
const PASTEL_COLORS = [
  '#BFDBFE', // baby blue
  '#DDD6FE', // soft lavender
  '#FED7AA', // light peach
  '#FEF08A', // pastel yellow
  '#FBCFE8', // soft pink
  '#FCD34D', // subtle gold
  '#E0F2FE'  // crystal blue
];

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  loadSavedConfig();
  initScrollAnimations();
  initCandles();
  initAudioPlayer();
  initLucideIcons();
  applyConfigToDOM();
});

// Load config from LocalStorage if present
function loadSavedConfig() {
  const saved = localStorage.getItem('jesulin_bday_config');
  if (saved) {
    try {
      config = { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
    } catch (e) {
      console.error("Error parsing saved config", e);
    }
  }
}

// Save config to LocalStorage
function saveConfigToStorage() {
  localStorage.setItem('jesulin_bday_config', JSON.stringify(config));
  applyConfigToDOM();
}

// Reset config to defaults
function resetConfig() {
  localStorage.removeItem('jesulin_bday_config');
  config = { ...DEFAULT_CONFIG };
  applyConfigToDOM();
  showToast("Restored original birthday details! ✨");
}

// Render dynamic fields into DOM
function applyConfigToDOM() {
  // Replace placeholders
  document.querySelectorAll('[data-bind="fullName"]').forEach(el => el.textContent = config.fullName);
  document.querySelectorAll('[data-bind="shortName"]').forEach(el => el.textContent = config.shortName);
  document.querySelectorAll('[data-bind="subtitle"]').forEach(el => el.textContent = config.subtitle);
  document.querySelectorAll('[data-bind="heroQuote"]').forEach(el => el.textContent = config.heroQuote);
  document.querySelectorAll('[data-bind="aboutHeading"]').forEach(el => el.textContent = config.aboutHeading);
  document.querySelectorAll('[data-bind="cinemaTagline"]').forEach(el => el.textContent = config.cinemaTagline);
  
  const letterEl = document.getElementById('letter-content');
  if (letterEl) {
    // Preserve formatting with paragraphs
    letterEl.innerHTML = config.letter
      .split('\n\n')
      .map(p => `<p class="mb-4">${p.replace(/\n/g, '<br/>')}</p>`)
      .join('');
  }

  const blessingEl = document.getElementById('numbers-prayer-text');
  if (blessingEl) blessingEl.textContent = config.blessingPrayer;

  const jeremiahEl = document.getElementById('jeremiah-prayer-text');
  if (jeremiahEl) jeremiahEl.textContent = config.jeremiahPrayer;
}

// Initialize Lucide Icons
function initLucideIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// Scroll Reveal with IntersectionObserver
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    observer.observe(el);
  });
}

// Confetti burst trigger
function triggerPastelConfetti(opts = {}) {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: opts.particleCount || 60,
      spread: opts.spread || 70,
      origin: opts.origin || { y: 0.65 },
      colors: PASTEL_COLORS,
      ticks: 240,
      gravity: 0.75,
      scalar: 1.1,
      disableForReducedMotion: true
    });
  }
}

// Massive celebratory burst
function triggerGrandCelebration() {
  if (typeof confetti === 'function') {
    const end = Date.now() + 2500;
    const interval = setInterval(() => {
      if (Date.now() > end) {
        return clearInterval(interval);
      }
      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 200,
        origin: { x: Math.random() * 0.8 + 0.1, y: Math.random() * 0.5 + 0.2 },
        colors: PASTEL_COLORS
      });
    }, 280);
  }
}

// Interactive Birthday Cake Candles
function initCandles() {
  const candles = document.querySelectorAll('.cake-candle');
  candles.forEach((candle, index) => {
    candle.addEventListener('click', () => {
      extinguishCandle(candle);
    });
  });
}

function extinguishCandle(candle) {
  const flame = candle.querySelector('.candle-flame');
  if (flame && !flame.classList.contains('flame-blown-out')) {
    flame.classList.add('flame-blown-out');
    createSmokePuff(candle);
    playChimeSound(600 + Math.random() * 200);

    // Check if all blown out
    const remainingFlames = document.querySelectorAll('.candle-flame:not(.flame-blown-out)');
    if (remainingFlames.length === 0) {
      setTimeout(() => {
        triggerPastelConfetti({ particleCount: 100, spread: 100 });
        showToast("🎉 Yay! You made a wish! May God grant all your prayers, Jesulin! 🎂");
        playCheerChime();
        const wishBanner = document.getElementById('cake-wish-banner');
        if (wishBanner) wishBanner.classList.remove('hidden');
      }, 300);
    }
  }
}

function blowAllCandles() {
  const candles = document.querySelectorAll('.cake-candle');
  candles.forEach((candle, idx) => {
    setTimeout(() => {
      extinguishCandle(candle);
    }, idx * 180);
  });
}

function relightCandles() {
  const flames = document.querySelectorAll('.candle-flame');
  flames.forEach(flame => {
    flame.classList.remove('flame-blown-out');
  });
  const wishBanner = document.getElementById('cake-wish-banner');
  if (wishBanner) wishBanner.classList.add('hidden');
  showToast("Candles relit! Make another wish! ✨");
}

function createSmokePuff(parent) {
  const smoke = document.createElement('div');
  smoke.className = 'smoke-puff absolute -top-6 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-300 rounded-full blur-[2px] pointer-events-none';
  parent.appendChild(smoke);
  setTimeout(() => smoke.remove(), 1200);
}

// Make a Wish Modal & Action
function handleMakeWish() {
  wishCount++;
  triggerGrandCelebration();
  playWishFanfare();

  const modal = document.getElementById('wish-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    const counterEl = document.getElementById('wish-counter-display');
    if (counterEl) counterEl.textContent = `Wishes made today: ${wishCount}`;
  }
}

function closeWishModal() {
  const modal = document.getElementById('wish-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

// Image Switcher in About Section
function switchPortrait(type) {
  const imgEl = document.getElementById('main-portrait-img');
  const badgeEl = document.getElementById('portrait-badge');
  const btnArt = document.getElementById('btn-view-art');
  const btnPhoto1 = document.getElementById('btn-view-photo1');
  const btnPhoto2 = document.getElementById('btn-view-photo2');

  [btnArt, btnPhoto1, btnPhoto2].forEach(btn => {
    if (btn) btn.classList.remove('bg-indigo-600', 'text-white', 'shadow-sm');
    if (btn) btn.classList.add('bg-white/80', 'text-gray-700');
  });

  if (!imgEl) return;

  imgEl.style.opacity = '0.3';
  imgEl.style.transform = 'scale(0.96)';

  setTimeout(() => {
    if (type === 'art') {
      imgEl.src = 'assets/jesulin_portrait_art.jpg';
      imgEl.alt = 'Jesulin Illustrated Portrait';
      if (badgeEl) badgeEl.textContent = '🎨 Illustrated Tribute Portrait';
      if (btnArt) {
        btnArt.classList.add('bg-indigo-600', 'text-white', 'shadow-sm');
        btnArt.classList.remove('bg-white/80', 'text-gray-700');
      }
    } else if (type === 'photo1') {
      imgEl.src = 'assets/jesulin_photo_1.jpg';
      imgEl.alt = 'Jesulin Smiling Photo';
      if (badgeEl) badgeEl.textContent = '📸 Pure Smiles & Joy';
      if (btnPhoto1) {
        btnPhoto1.classList.add('bg-indigo-600', 'text-white', 'shadow-sm');
        btnPhoto1.classList.remove('bg-white/80', 'text-gray-700');
      }
    } else if (type === 'photo2') {
      imgEl.src = 'assets/jesulin_photo_2.jpg';
      imgEl.alt = 'Jesulin Blazer Photo';
      if (badgeEl) badgeEl.textContent = '🎬 Sharp & Dapper Look';
      if (btnPhoto2) {
        btnPhoto2.classList.add('bg-indigo-600', 'text-white', 'shadow-sm');
        btnPhoto2.classList.remove('bg-white/80', 'text-gray-700');
      }
    }
    imgEl.style.opacity = '1';
    imgEl.style.transform = 'scale(1)';
  }, 200);
}

// Scripture Tab Switcher
function switchVerseTab(verse) {
  const tabNumbers = document.getElementById('tab-numbers');
  const tabJeremiah = document.getElementById('tab-jeremiah');
  const contentNumbers = document.getElementById('content-numbers');
  const contentJeremiah = document.getElementById('content-jeremiah');

  if (verse === 'numbers') {
    tabNumbers.classList.add('bg-amber-100/90', 'text-amber-950', 'border-amber-300');
    tabNumbers.classList.remove('bg-white/60', 'text-gray-600', 'border-transparent');
    tabJeremiah.classList.remove('bg-amber-100/90', 'text-amber-950', 'border-amber-300');
    tabJeremiah.classList.add('bg-white/60', 'text-gray-600', 'border-transparent');

    contentNumbers.classList.remove('hidden');
    contentJeremiah.classList.add('hidden');
  } else {
    tabJeremiah.classList.add('bg-amber-100/90', 'text-amber-950', 'border-amber-300');
    tabJeremiah.classList.remove('bg-white/60', 'text-gray-600', 'border-transparent');
    tabNumbers.classList.remove('bg-amber-100/90', 'text-amber-950', 'border-amber-300');
    tabNumbers.classList.add('bg-white/60', 'text-gray-600', 'border-transparent');

    contentJeremiah.classList.remove('hidden');
    contentNumbers.classList.add('hidden');
  }
}

// Copy Letter to Clipboard
function copyLetterToClipboard() {
  const rawText = `Dear ${config.shortName},\n\n${config.letter}\n\nHave the happiest birthday! Stay blessed!`;
  navigator.clipboard.writeText(rawText).then(() => {
    showToast("💌 Birthday letter copied to clipboard!");
  }).catch(() => {
    showToast("Copied note!");
  });
}

// Simple Toast Notification
function showToast(message) {
  const existing = document.getElementById('birthday-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'birthday-toast';
  toast.className = 'fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900/90 backdrop-blur-md text-white px-6 py-3 rounded-full text-sm font-medium shadow-2xl flex items-center space-x-2 z-50 transition-all duration-300 animate-bounce';
  toast.innerHTML = `<span>${message}</span>`;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translate(-50%, 20px)';
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}

// In-Page Customization Modal Handlers
function openEditModal() {
  const modal = document.getElementById('edit-modal');
  if (!modal) return;

  document.getElementById('input-full-name').value = config.fullName;
  document.getElementById('input-short-name').value = config.shortName;
  document.getElementById('input-subtitle').value = config.subtitle;
  document.getElementById('input-letter').value = config.letter;
  document.getElementById('input-blessing').value = config.blessingPrayer;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeEditModal() {
  const modal = document.getElementById('edit-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function saveCustomizations() {
  const fullName = document.getElementById('input-full-name').value.trim();
  const shortName = document.getElementById('input-short-name').value.trim();
  const subtitle = document.getElementById('input-subtitle').value.trim();
  const letter = document.getElementById('input-letter').value.trim();
  const blessing = document.getElementById('input-blessing').value.trim();

  if (fullName) config.fullName = fullName;
  if (shortName) config.shortName = shortName;
  if (subtitle) config.subtitle = subtitle;
  if (letter) config.letter = letter;
  if (blessing) config.blessingPrayer = blessing;

  saveConfigToStorage();
  closeEditModal();
  showToast("Your changes have been saved! ✨");
}

/* ============================================================
   WEB AUDIO API - Calming Acoustic Pastel Birthday Melody
   Zero external audio dependencies, works 100% offline & clean.
============================================================ */

function initAudioPlayer() {
  const toggleBtn = document.getElementById('music-toggle-btn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleAudio);
  }
}

function toggleAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  audioPlaying = !audioPlaying;
  updateAudioUI();

  if (audioPlaying) {
    playMelodyLoop();
    showToast("🎵 Playing gentle pastel birthday melody...");
  } else {
    stopMelodyLoop();
    showToast("Music paused ⏸️");
  }
}

function updateAudioUI() {
  const btn = document.getElementById('music-toggle-btn');
  const label = document.getElementById('music-label');
  const bars = document.querySelectorAll('.audio-bar');

  if (audioPlaying) {
    if (btn) btn.classList.add('bg-indigo-100', 'text-indigo-800');
    if (label) label.textContent = 'Pause Music';
    bars.forEach(bar => bar.style.animationPlayState = 'running');
  } else {
    if (btn) btn.classList.remove('bg-indigo-100', 'text-indigo-800');
    if (label) label.textContent = 'Play Music';
    bars.forEach(bar => bar.style.animationPlayState = 'paused');
  }
}

// Gentle music-box chime notes
// Notes frequencies in Hz: C4, D4, E4, F4, G4, A4, B4, C5, etc.
const NOTE_FREQS = {
  'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
  'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23,
  'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
  'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99
};

// Peaceful acoustic Birthday Theme melody sequence [note, duration in seconds]
const BIRTHDAY_MELODY = [
  ['G4', 0.35], ['G4', 0.35], ['A4', 0.7], ['G4', 0.7], ['C5', 0.7], ['B4', 1.2],
  ['G4', 0.35], ['G4', 0.35], ['A4', 0.7], ['G4', 0.7], ['D5', 0.7], ['C5', 1.2],
  ['G4', 0.35], ['G4', 0.35], ['G5', 0.7], ['E5', 0.7], ['C5', 0.7], ['B4', 0.7], ['A4', 0.9],
  ['F5', 0.35], ['F5', 0.35], ['E5', 0.7], ['C5', 0.7], ['D5', 0.7], ['C5', 1.5]
];

function playNote(freq, startTime, duration) {
  if (!audioCtx) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  // Warm chime: mix sine & triangle
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, startTime);

  // Soft envelope
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(0.12, startTime + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 1.3);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration * 1.4);
}

function playMelodyLoop() {
  if (!audioPlaying || !audioCtx) return;

  let currentTime = audioCtx.currentTime + 0.1;
  let totalDuration = 0;

  BIRTHDAY_MELODY.forEach(([noteName, dur]) => {
    const freq = NOTE_FREQS[noteName] || 440;
    playNote(freq, currentTime, dur);
    currentTime += dur * 0.75;
    totalDuration += dur * 0.75;
  });

  // Loop again after completion plus a soft pause
  melodyInterval = setTimeout(() => {
    if (audioPlaying) playMelodyLoop();
  }, (totalDuration + 2.5) * 1000);
}

function stopMelodyLoop() {
  if (melodyInterval) {
    clearTimeout(melodyInterval);
    melodyInterval = null;
  }
}

// Single Chime SFX for candle blowing
function playChimeSound(freq = 660) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = audioCtx || new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.75);
  } catch (e) {}
}

function playCheerChime() {
  [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
    setTimeout(() => playChimeSound(freq), i * 140);
  });
}

function playWishFanfare() {
  [440, 554.37, 659.25, 880].forEach((freq, i) => {
    setTimeout(() => playChimeSound(freq), i * 160);
  });
}
