// Simple Morse Code Practice Widget for VU33CM website

const MORSE = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', '/': '-..-.', '=': '-...-'
};

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

let currentChar = '';
let score = 0;
let total = 0;
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playTone(freq, duration) {
  initAudio();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.frequency.value = freq;
  osc.type = 'sine';
  gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + duration);
}

function playMorse(code) {
  initAudio();
  let time = 0;
  const unit = 0.08; // ~15 WPM character speed
  const parts = [];

  for (let i = 0; i < code.length; i++) {
    if (code[i] === '.') {
      parts.push({ type: 'dit', start: time });
      time += unit;
    } else if (code[i] === '-') {
      parts.push({ type: 'dah', start: time });
      time += unit * 3;
    }
    time += unit; // inter-element space
  }

  parts.forEach(p => {
    setTimeout(() => {
      playTone(600, p.type === 'dit' ? unit : unit * 3);
    }, p.start * 1000);
  });
}

function nextChar() {
  currentChar = LETTERS[Math.floor(Math.random() * LETTERS.length)];
  document.getElementById('morse-display').textContent = 'Listening...';
  document.getElementById('morse-feedback').textContent = '';
  document.getElementById('morse-input').value = '';
  document.getElementById('morse-input').focus();
  setTimeout(() => playMorse(MORSE[currentChar]), 300);
}

function checkAnswer() {
  const input = document.getElementById('morse-input').value.trim().toUpperCase();
  total++;
  if (input === currentChar) {
    score++;
    document.getElementById('morse-feedback').textContent = '✓ Correct! ' + currentChar + ' = ' + MORSE[currentChar];
    document.getElementById('morse-feedback').style.color = '#2ecc71';
  } else {
    document.getElementById('morse-feedback').textContent = '✗ It was ' + currentChar + ' (' + MORSE[currentChar] + ')';
    document.getElementById('morse-feedback').style.color = '#e74c3c';
  }
  document.getElementById('morse-score').textContent = 'Score: ' + score + ' / ' + total;
  setTimeout(nextChar, 1500);
}

function revealChar() {
  document.getElementById('morse-display').textContent = currentChar + '  →  ' + MORSE[currentChar];
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  const widget = document.getElementById('morse-widget');
  if (!widget) return;

  widget.innerHTML = `
    <div style="background:var(--card-bg);border-radius:12px;padding:1.5rem;border:1px solid rgba(0,180,216,0.2);">
      <h3 style="color:var(--accent);margin-bottom:1rem;">Morse Code Practice Widget</h3>
      <p style="color:var(--text-muted);font-size:0.9rem;margin-bottom:1rem;">Listen to the Morse character and type what you hear. Great for ASOC General Grade practice!</p>
      
      <div id="morse-display" style="font-size:1.8rem;font-weight:700;color:#fff;text-align:center;padding:1rem;background:rgba(0,0,0,0.3);border-radius:8px;margin-bottom:1rem;min-height:60px;display:flex;align-items:center;justify-content:center;">
        Click Start to begin
      </div>
      
      <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:1rem;justify-content:center;">
        <button onclick="nextChar()" class="btn btn-primary" style="padding:0.6rem 1.2rem;">▶ Play / Next</button>
        <button onclick="revealChar()" class="btn btn-outline" style="padding:0.6rem 1.2rem;margin:0;">Show Answer</button>
      </div>
      
      <div style="display:flex;gap:0.5rem;justify-content:center;align-items:center;flex-wrap:wrap;">
        <input id="morse-input" type="text" maxlength="1" placeholder="Type letter/number" 
          style="padding:0.7rem 1rem;border-radius:8px;border:1px solid rgba(0,180,216,0.3);background:#0a1628;color:#fff;font-size:1.1rem;width:160px;text-align:center;text-transform:uppercase;"
          onkeydown="if(event.key==='Enter') checkAnswer()">
        <button onclick="checkAnswer()" class="btn btn-primary" style="padding:0.6rem 1.2rem;">Check</button>
      </div>
      
      <p id="morse-feedback" style="text-align:center;margin-top:1rem;min-height:1.5rem;font-weight:600;"></p>
      <p id="morse-score" style="text-align:center;color:var(--text-muted);font-size:0.9rem;">Score: 0 / 0</p>
    </div>
  `;
});