/**
 * Morse Code Practice Widget — HAM Corner by VU33CM
 * RX (copying) + TX (sending) practice for ASOC / CW learning
 */
(function () {
  "use strict";

  // ---------- Morse tables ----------
  const MORSE = {
    A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.",
    G: "--.", H: "....", I: "..", J: ".---", K: "-.-", L: ".-..",
    M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.",
    S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-",
    Y: "-.--", Z: "--..",
    "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-",
    "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
    ".": ".-.-.-", ",": "--..--", "?": "..--..", "/": "-..-.",
    "=": "-...-", "+": ".-.-.", "-": "-....-", "@": ".--.-."
  };

  const PROSIGNS = {
    AR: ".-.-.",   // end of message
    SK: "...-.-",  // end of contact
    BT: "-...-",   // break / separator
    KN: "-.--.",   // invitation to specific station
    BK: "-...-.-", // break
    SOS: "...---..."
  };

  const COMMON_WORDS = [
    "CQ", "DE", "QRZ", "QTH", "QSL", "RST", "73", "88", "TU", "TNX",
    "NAME", "RIG", "ANT", "WX", "UR", "FB", "GM", "GE", "GA", "OM",
    "YL", "XYL", "HW", "CPY", "PSE", "AGN", "RPT", "BK", "K", "KN"
  ];

  // Reverse map for TX check
  const REVERSE = {};
  Object.keys(MORSE).forEach((ch) => { REVERSE[MORSE[ch]] = ch; });
  Object.keys(PROSIGNS).forEach((ps) => { REVERSE[PROSIGNS[ps]] = ps; });

  // ---------- State ----------
  let audioCtx = null;
  let mode = "rx";           // 'rx' | 'tx'
  let charset = "letters";   // letters | numbers | alphanum | prosigns | words
  let wpm = 15;
  let farnsworth = true;     // extra space between characters
  let toneHz = 600;
  let currentTarget = "";    // character or word being practiced
  let score = 0;
  let total = 0;
  let streak = 0;
  let playing = false;
  let keyBuffer = "";        // for TX: dots/dashes the user "sends"
  let keyDownAt = 0;

  // Timing (PARIS standard)
  function unitMs() {
    // 1 WPM ≈ 50 units per minute for PARIS → unit = 1200/WPM ms
    return 1200 / wpm;
  }

  // ---------- Audio ----------
  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === "suspended") audioCtx.resume();
  }

  function playTone(freq, durationSec, startAt) {
    initAudio();
    const t0 = startAt != null ? startAt : audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.value = freq;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(0.18, t0 + 0.008);
    gain.gain.setValueAtTime(0.18, t0 + durationSec - 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + durationSec);
    osc.start(t0);
    osc.stop(t0 + durationSec + 0.02);
  }

  function scheduleMorse(code, startTime) {
    initAudio();
    const u = unitMs() / 1000; // seconds
    let t = startTime != null ? startTime : audioCtx.currentTime + 0.05;
    for (let i = 0; i < code.length; i++) {
      if (code[i] === ".") {
        playTone(toneHz, u, t);
        t += u;
      } else if (code[i] === "-") {
        playTone(toneHz, u * 3, t);
        t += u * 3;
      }
      t += u; // inter-element space
    }
    return t;
  }

  function playSequence(text, done) {
    if (playing) return;
    playing = true;
    initAudio();
    const u = unitMs() / 1000;
    let t = audioCtx.currentTime + 0.08;
    const chars = text.toUpperCase().split("");

    chars.forEach((ch) => {
      let code = MORSE[ch] || PROSIGNS[ch];
      if (!code && ch === " ") {
        t += u * 4; // extra word space
        return;
      }
      if (!code) return;
      t = scheduleMorse(code, t);
      // inter-character space (Farnsworth: stretch if enabled)
      const charSpace = farnsworth ? u * 5 : u * 2;
      t += charSpace;
    });

    const totalMs = (t - audioCtx.currentTime) * 1000 + 80;
    setTimeout(() => {
      playing = false;
      if (typeof done === "function") done();
    }, totalMs);
  }

  // ---------- Character selection ----------
  function pickTarget() {
    if (charset === "letters") {
      const L = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      return L[Math.floor(Math.random() * L.length)];
    }
    if (charset === "numbers") {
      return String(Math.floor(Math.random() * 10));
    }
    if (charset === "alphanum") {
      const L = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      return L[Math.floor(Math.random() * L.length)];
    }
    if (charset === "prosigns") {
      const keys = Object.keys(PROSIGNS);
      return keys[Math.floor(Math.random() * keys.length)];
    }
    if (charset === "words") {
      return COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)];
    }
    return "E";
  }

  function codeFor(target) {
    if (PROSIGNS[target]) return PROSIGNS[target];
    if (target.length === 1) return MORSE[target] || "";
    return target.split("").map((c) => MORSE[c] || "").join(" ");
  }

  // ---------- UI helpers ----------
  function $(id) { return document.getElementById(id); }

  function setFeedback(msg, ok) {
    const el = $("morse-feedback");
    if (!el) return;
    el.textContent = msg;
    el.style.color = ok === true ? "#2ecc71" : ok === false ? "#e74c3c" : "var(--text-muted, #8b9bb0)";
  }

  function updateScore() {
    const el = $("morse-score");
    if (el) el.textContent = `Score: ${score} / ${total}` + (streak > 1 ? `  ·  Streak: ${streak}` : "");
  }

  function updateDisplay(text) {
    const el = $("morse-display");
    if (el) el.textContent = text;
  }

  // ---------- RX mode ----------
  function rxNext() {
    currentTarget = pickTarget();
    keyBuffer = "";
    updateDisplay("Listening…");
    setFeedback("", null);
    const input = $("morse-input");
    if (input) {
      input.value = "";
      input.disabled = false;
      input.focus();
    }
    setTimeout(() => {
      playSequence(currentTarget, () => {
        updateDisplay("Your answer?");
      });
    }, 250);
  }

  function rxCheck() {
    const input = $("morse-input");
    if (!input) return;
    const val = input.value.trim().toUpperCase();
    if (!val) return;
    total++;
    if (val === currentTarget) {
      score++;
      streak++;
      setFeedback(`✓ Correct!  ${currentTarget}  =  ${codeFor(currentTarget)}`, true);
    } else {
      streak = 0;
      setFeedback(`✗ It was ${currentTarget}  (${codeFor(currentTarget)})`, false);
    }
    updateScore();
    input.disabled = true;
    setTimeout(rxNext, 1600);
  }

  function rxReveal() {
    updateDisplay(`${currentTarget}  →  ${codeFor(currentTarget)}`);
    setFeedback("Revealed — listen again or go Next", null);
  }

  function rxRepeat() {
    if (!currentTarget) return;
    updateDisplay("Listening…");
    playSequence(currentTarget, () => updateDisplay("Your answer?"));
  }

  // ---------- TX mode ----------
  function txNext() {
    currentTarget = pickTarget();
    keyBuffer = "";
    updateDisplay(`Send:  ${currentTarget}`);
    setFeedback(`Target Morse:  ${codeFor(currentTarget)}`, null);
    const input = $("morse-input");
    if (input) {
      input.value = "";
      input.placeholder = "Type dots/dashes  ( .  and  - )  then Enter";
      input.disabled = false;
      input.focus();
    }
    const vis = $("morse-key-visual");
    if (vis) vis.textContent = "";
  }

  function txPlayTarget() {
    if (!currentTarget) return;
    playSequence(currentTarget);
  }

  function txCheck() {
    const input = $("morse-input");
    if (!input) return;
    let val = input.value.trim().toUpperCase().replace(/\s+/g, "");
    total++;

    val = val.replace(/[·•]/g, ".").replace(/[–—_]/g, "-");

    const expectedCode = (PROSIGNS[currentTarget] || MORSE[currentTarget] || codeFor(currentTarget)).replace(/\s+/g, "");
    const expectedChar = currentTarget;

    let correct = false;
    if (val === expectedChar) correct = true;
    else if (val === expectedCode) correct = true;
    else if (REVERSE[val] === expectedChar) correct = true;

    if (correct) {
      score++;
      streak++;
      setFeedback(`✓ Good send!  ${currentTarget}  =  ${expectedCode}`, true);
      playSequence(currentTarget);
    } else {
      streak = 0;
      setFeedback(`✗ Expected ${expectedCode}  (${currentTarget}). You entered: ${val || "(empty)"}`, false);
      playSequence(currentTarget);
    }
    updateScore();
    setTimeout(txNext, 2000);
  }

  // Simple keying with mouse / space (dit on short, dah on long)
  function onKeyPadDown() {
    keyDownAt = Date.now();
    initAudio();
  }
  function onKeyPadUp() {
    if (!keyDownAt) return;
    const dur = Date.now() - keyDownAt;
    keyDownAt = 0;
    const u = unitMs();
    if (dur < u * 2) {
      keyBuffer += ".";
      playTone(toneHz, u / 1000);
    } else {
      keyBuffer += "-";
      playTone(toneHz, (u * 3) / 1000);
    }
    const vis = $("morse-key-visual");
    if (vis) vis.textContent = keyBuffer;
    const input = $("morse-input");
    if (input) input.value = keyBuffer;
  }

  // ---------- Settings ----------
  function applySettings() {
    const w = $("morse-wpm");
    const t = $("morse-tone");
    const f = $("morse-farnsworth");
    const c = $("morse-charset");
    if (w) wpm = parseInt(w.value, 10) || 15;
    if (t) toneHz = parseInt(t.value, 10) || 600;
    if (f) farnsworth = f.checked;
    if (c) charset = c.value;
  }

  function switchMode(newMode) {
    mode = newMode;
    score = 0;
    total = 0;
    streak = 0;
    updateScore();
    keyBuffer = "";

    const rxBtn = $("morse-mode-rx");
    const txBtn = $("morse-mode-tx");
    if (rxBtn && txBtn) {
      rxBtn.classList.toggle("active", mode === "rx");
      txBtn.classList.toggle("active", mode === "tx");
    }

    const hint = $("morse-mode-hint");
    if (hint) {
      hint.textContent =
        mode === "rx"
          ? "RX mode: Listen to the Morse and type the character or word you hear."
          : "TX mode: Look at the character, type its Morse (dots and dashes) or the character itself, then Check. Use the Key button for practice keying.";
    }

    const input = $("morse-input");
    if (input) {
      input.placeholder = mode === "rx" ? "Type letter / number / word" : "Type Morse (.-) or the character";
      input.maxLength = mode === "rx" ? 12 : 32;
    }

    if (mode === "rx") rxNext();
    else txNext();
  }

  // ---------- Build UI ----------
  function buildWidget(container) {
    container.innerHTML = `
      <div class="morse-card">
        <h3 class="morse-title">Morse Code Practice</h3>
        <p class="morse-sub">RX (copying) &amp; TX (sending) · ASOC / CW learning · HAM Corner by VU33CM</p>

        <div class="morse-modes">
          <button type="button" id="morse-mode-rx" class="morse-mode-btn active">RX — Listen &amp; Copy</button>
          <button type="button" id="morse-mode-tx" class="morse-mode-btn">TX — Send Practice</button>
        </div>
        <p id="morse-mode-hint" class="morse-hint">RX mode: Listen to the Morse and type the character or word you hear.</p>

        <div class="morse-settings">
          <label>Charset
            <select id="morse-charset">
              <option value="letters">Letters A–Z</option>
              <option value="numbers">Numbers 0–9</option>
              <option value="alphanum">Letters + Numbers</option>
              <option value="prosigns">Prosigns (AR, SK, BT…)</option>
              <option value="words">Common CW words / Q-codes</option>
            </select>
          </label>
          <label>Speed
            <select id="morse-wpm">
              <option value="10">10 WPM</option>
              <option value="12">12 WPM</option>
              <option value="15" selected>15 WPM</option>
              <option value="18">18 WPM</option>
              <option value="20">20 WPM</option>
              <option value="25">25 WPM</option>
              <option value="30">30 WPM</option>
            </select>
          </label>
          <label>Tone
            <select id="morse-tone">
              <option value="500">500 Hz</option>
              <option value="600" selected>600 Hz</option>
              <option value="700">700 Hz</option>
              <option value="800">800 Hz</option>
            </select>
          </label>
          <label class="morse-check">
            <input type="checkbox" id="morse-farnsworth" checked />
            Farnsworth spacing
          </label>
        </div>

        <div id="morse-display" class="morse-display">Choose RX or TX, then Start</div>
        <div id="morse-key-visual" class="morse-key-visual"></div>

        <div class="morse-actions">
          <button type="button" id="morse-play" class="morse-btn primary">▶ Play / Next</button>
          <button type="button" id="morse-repeat" class="morse-btn">↻ Repeat</button>
          <button type="button" id="morse-reveal" class="morse-btn">Show Answer</button>
          <button type="button" id="morse-keypad" class="morse-btn" title="Hold for dah, tap for dit">⌨ Key</button>
        </div>

        <div class="morse-input-row">
          <input id="morse-input" type="text" maxlength="12" placeholder="Type letter / number / word"
            autocomplete="off" autocapitalize="characters" />
          <button type="button" id="morse-check" class="morse-btn primary">Check</button>
        </div>

        <p id="morse-feedback" class="morse-feedback"></p>
        <p id="morse-score" class="morse-score">Score: 0 / 0</p>

        <div class="morse-ref">
          <details>
            <summary>Quick Morse reference</summary>
            <div class="morse-ref-grid" id="morse-ref-grid"></div>
          </details>
        </div>
      </div>
    `;

    // Reference grid
    const grid = $("morse-ref-grid");
    if (grid) {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");
      grid.innerHTML = chars
        .map((c) => `<span><b>${c}</b> ${MORSE[c]}</span>`)
        .join("");
    }

    // Events
    $("morse-mode-rx").addEventListener("click", () => switchMode("rx"));
    $("morse-mode-tx").addEventListener("click", () => switchMode("tx"));

    ["morse-charset", "morse-wpm", "morse-tone", "morse-farnsworth"].forEach((id) => {
      const el = $(id);
      if (el) el.addEventListener("change", applySettings);
    });

    $("morse-play").addEventListener("click", () => {
      applySettings();
      if (mode === "rx") rxNext();
      else txNext();
    });
    $("morse-repeat").addEventListener("click", () => {
      applySettings();
      if (mode === "rx") rxRepeat();
      else txPlayTarget();
    });
    $("morse-reveal").addEventListener("click", () => {
      if (mode === "rx") rxReveal();
      else updateDisplay(`${currentTarget}  →  ${codeFor(currentTarget)}`);
    });
    $("morse-check").addEventListener("click", () => {
      applySettings();
      if (mode === "rx") rxCheck();
      else txCheck();
    });

    $("morse-input").addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        applySettings();
        if (mode === "rx") rxCheck();
        else txCheck();
      }
    });

    // Simple keying pad
    const pad = $("morse-keypad");
    pad.addEventListener("mousedown", onKeyPadDown);
    pad.addEventListener("mouseup", onKeyPadUp);
    pad.addEventListener("mouseleave", () => { if (keyDownAt) onKeyPadUp(); });
    pad.addEventListener("touchstart", (e) => { e.preventDefault(); onKeyPadDown(); }, { passive: false });
    pad.addEventListener("touchend", (e) => { e.preventDefault(); onKeyPadUp(); });

    // Inject styles once
    if (!document.getElementById("morse-widget-styles")) {
      const style = document.createElement("style");
      style.id = "morse-widget-styles";
      style.textContent = `
        .morse-card {
          background: var(--card-bg, #141a22);
          border-radius: 12px;
          padding: 1.35rem 1.5rem;
          border: 1px solid rgba(0,180,216,0.22);
          color: var(--text, #e6edf5);
          font-family: system-ui, -apple-system, Segoe UI, sans-serif;
        }
        .morse-title { color: var(--accent, #3ecf8e); margin: 0 0 0.25rem; font-size: 1.2rem; }
        .morse-sub { color: var(--text-muted, #8b9bb0); font-size: 0.85rem; margin: 0 0 1rem; }
        .morse-modes { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.5rem; }
        .morse-mode-btn {
          flex: 1; min-width: 140px; padding: 0.55rem 0.9rem; border-radius: 8px;
          border: 1px solid rgba(0,180,216,0.35); background: #0a1628; color: #c5d0dc;
          cursor: pointer; font-weight: 600; font-size: 0.9rem;
        }
        .morse-mode-btn.active {
          background: rgba(62,207,142,0.18); border-color: #3ecf8e; color: #3ecf8e;
        }
        .morse-hint { font-size: 0.82rem; color: var(--text-muted, #8b9bb0); margin: 0 0 1rem; }
        .morse-settings {
          display: flex; flex-wrap: wrap; gap: 0.75rem 1.1rem; margin-bottom: 1rem;
          font-size: 0.85rem; color: var(--text-muted, #8b9bb0); align-items: center;
        }
        .morse-settings label { display: flex; flex-direction: column; gap: 0.25rem; }
        .morse-settings select {
          padding: 0.4rem 0.6rem; border-radius: 6px; border: 1px solid rgba(0,180,216,0.3);
          background: #0a1628; color: #fff; min-width: 110px;
        }
        .morse-check { flex-direction: row !important; align-items: center; gap: 0.4rem !important; cursor: pointer; }
        .morse-display {
          font-size: 1.65rem; font-weight: 700; color: #fff; text-align: center;
          padding: 1rem; background: rgba(0,0,0,0.35); border-radius: 8px;
          margin-bottom: 0.5rem; min-height: 64px; display: flex; align-items: center; justify-content: center;
          letter-spacing: 0.04em;
        }
        .morse-key-visual {
          text-align: center; font-family: ui-monospace, monospace; font-size: 1.2rem;
          color: #4da3ff; min-height: 1.4rem; margin-bottom: 0.75rem;
        }
        .morse-actions { display: flex; gap: 0.45rem; flex-wrap: wrap; justify-content: center; margin-bottom: 0.9rem; }
        .morse-btn {
          padding: 0.55rem 1rem; border-radius: 8px; border: 1px solid rgba(0,180,216,0.3);
          background: #0a1628; color: #e6edf5; cursor: pointer; font-weight: 600; font-size: 0.9rem;
        }
        .morse-btn.primary { background: #3ecf8e; color: #0b0f14; border-color: #3ecf8e; }
        .morse-btn:hover { filter: brightness(1.08); }
        .morse-input-row { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; margin-bottom: 0.5rem; }
        #morse-input {
          padding: 0.65rem 1rem; border-radius: 8px; border: 1px solid rgba(0,180,216,0.3);
          background: #0a1628; color: #fff; font-size: 1.05rem; width: 200px; text-align: center;
          text-transform: uppercase;
        }
        .morse-feedback { text-align: center; margin: 0.6rem 0 0.2rem; min-height: 1.4rem; font-weight: 600; }
        .morse-score { text-align: center; color: var(--text-muted, #8b9bb0); font-size: 0.9rem; margin: 0; }
        .morse-ref { margin-top: 1.1rem; font-size: 0.85rem; color: var(--text-muted, #8b9bb0); }
        .morse-ref summary { cursor: pointer; color: #4da3ff; }
        .morse-ref-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
          gap: 0.35rem; margin-top: 0.6rem; font-family: ui-monospace, monospace; font-size: 0.8rem;
        }
        .morse-ref-grid span { background: rgba(0,0,0,0.25); padding: 0.25rem 0.35rem; border-radius: 4px; }
        .morse-ref-grid b { color: #3ecf8e; margin-right: 0.25rem; }
        @media (max-width: 520px) {
          .morse-display { font-size: 1.35rem; }
          #morse-input { width: 100%; max-width: 220px; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // ---------- Init ----------
  function init() {
    const widget = document.getElementById("morse-widget");
    if (!widget) return;
    buildWidget(widget);
    applySettings();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Expose for optional external use
  window.morsePractice = {
    next: () => { applySettings(); mode === "rx" ? rxNext() : txNext(); },
    check: () => { applySettings(); mode === "rx" ? rxCheck() : txCheck(); },
    reveal: () => { mode === "rx" ? rxReveal() : updateDisplay(`${currentTarget}  →  ${codeFor(currentTarget)}`); }
  };
})();
