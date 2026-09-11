/**
 * HAM Corner by VU33CM — ASOC Exam Practice Quiz
 * Client-side only — works on GitHub Pages
 */

(function () {
  "use strict";

  let allQuestions = [];
  let quizQuestions = [];
  let currentIndex = 0;
  let answers = []; // { selected, correct, isCorrect }
  let timerInterval = null;
  let secondsLeft = 0;
  let isMockExam = false;

  const $ = (sel) => document.querySelector(sel);
  const screens = {
    home: $("#home"),
    quiz: $("#quiz"),
    results: $("#results"),
  };

  function showScreen(name) {
    Object.values(screens).forEach((s) => s.classList.remove("active"));
    screens[name].classList.add("active");
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  async function loadQuestions() {
    try {
      const res = await fetch("questions.json");
      if (!res.ok) throw new Error("Failed to load questions.json");
      allQuestions = await res.json();
      if (!Array.isArray(allQuestions) || allQuestions.length === 0) {
        throw new Error("Question bank is empty");
      }
      populateCategories();
      console.log(`Loaded ${allQuestions.length} questions`);
    } catch (err) {
      console.error(err);
      alert(
        "Could not load the question bank. Make sure questions.json is in the same folder as quiz.html and you are serving the files (GitHub Pages or a local server)."
      );
    }
  }

  function populateCategories() {
    const cats = [...new Set(allQuestions.map((q) => q.category))].sort();
    const sel = $("#category");
    cats.forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      sel.appendChild(opt);
    });
  }

  function startQuiz() {
    const cat = $("#category").value;
    const diff = $("#difficulty").value;
    const len = parseInt($("#quizLength").value, 10);

    let pool = allQuestions.slice();
    if (cat !== "all") pool = pool.filter((q) => q.category === cat);
    if (diff !== "all") pool = pool.filter((q) => q.difficulty === diff);

    if (pool.length === 0) {
      alert("No questions match the selected filters. Try a different combination.");
      return;
    }

    pool = shuffle(pool);
    const count = Math.min(len, pool.length);
    quizQuestions = pool.slice(0, count).map((q) => {
      // Shuffle options for each question
      const opts = shuffle(q.options.slice());
      return { ...q, options: opts };
    });

    currentIndex = 0;
    answers = [];
    isMockExam = len === 100;

    if (isMockExam) {
      // ~1.2 min per question average for mock
      secondsLeft = count * 72;
      $("#timerDisplay").style.display = "inline";
      startTimer();
    } else {
      $("#timerDisplay").style.display = "none";
      if (timerInterval) clearInterval(timerInterval);
    }

    showScreen("quiz");
    renderQuestion();
  }

  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    updateTimerDisplay();
    timerInterval = setInterval(() => {
      secondsLeft--;
      updateTimerDisplay();
      if (secondsLeft <= 0) {
        clearInterval(timerInterval);
        finishQuiz();
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    const m = Math.floor(secondsLeft / 60);
    const s = secondsLeft % 60;
    $("#timerDisplay").textContent =
      `Time: ${m}:${s.toString().padStart(2, "0")}`;
  }

  function renderQuestion() {
    const q = quizQuestions[currentIndex];
    const total = quizQuestions.length;

    $("#progressText").textContent = `Question ${currentIndex + 1} of ${total}`;
    $("#progressFill").style.width = `${((currentIndex) / total) * 100}%`;

    const badge = $("#catBadge");
    badge.textContent = `${q.category} · ${q.difficulty}`;
    badge.className = "badge diff-" + q.difficulty.toLowerCase();

    $("#questionText").textContent = q.question;

    const optsEl = $("#options");
    optsEl.innerHTML = "";
    const letters = ["A", "B", "C", "D"];
    q.options.forEach((opt, i) => {
      const btn = document.createElement("button");
      btn.className = "option";
      btn.type = "button";
      btn.innerHTML = `<span class="letter">${letters[i]}</span><span>${escapeHtml(opt)}</span>`;
      btn.addEventListener("click", () => selectOption(i, btn));
      optsEl.appendChild(btn);
    });

    $("#explanation").classList.remove("visible");
    $("#explanation").textContent = "";
    $("#nextBtn").style.display = "none";
  }

  function escapeHtml(str) {
    const d = document.createElement("div");
    d.textContent = str;
    return d.innerHTML;
  }

  function selectOption(index, btnEl) {
    if (answers[currentIndex] !== undefined) return; // already answered

    const q = quizQuestions[currentIndex];
    const selected = q.options[index];
    const isCorrect = selected === q.answer;

    answers[currentIndex] = { selected, correct: q.answer, isCorrect };

    // Mark options
    const optionBtns = $("#options").querySelectorAll(".option");
    optionBtns.forEach((b, i) => {
      b.classList.add("disabled");
      const text = q.options[i];
      if (text === q.answer) b.classList.add("correct");
      else if (i === index && !isCorrect) b.classList.add("incorrect");
      if (i === index) b.classList.add("selected");
    });

    // Show explanation
    const expl = $("#explanation");
    expl.innerHTML = `<strong>${isCorrect ? "Correct" : "Incorrect"}.</strong> ${escapeHtml(q.explanation)}`;
    expl.classList.add("visible");

    $("#nextBtn").style.display = "inline-block";
    $("#nextBtn").textContent =
      currentIndex === quizQuestions.length - 1 ? "See Results" : "Next";
  }

  function nextQuestion() {
    if (currentIndex < quizQuestions.length - 1) {
      currentIndex++;
      renderQuestion();
    } else {
      finishQuiz();
    }
  }

  function finishQuiz() {
    if (timerInterval) clearInterval(timerInterval);
    $("#progressFill").style.width = "100%";

    const correct = answers.filter((a) => a && a.isCorrect).length;
    const total = quizQuestions.length;
    const wrong = total - correct;
    const pct = total ? Math.round((correct / total) * 100) : 0;

    $("#scorePct").textContent = pct + "%";
    $("#correctCount").textContent = correct;
    $("#wrongCount").textContent = wrong;
    $("#totalCount").textContent = total;

    // Colour the circle
    const circle = document.querySelector(".score-circle");
    if (pct >= 70) circle.style.borderColor = "var(--ok)";
    else if (pct >= 50) circle.style.borderColor = "var(--warn)";
    else circle.style.borderColor = "var(--error)";

    $("#reviewCard").style.display = "none";
    showScreen("results");
  }

  function showReview() {
    const list = $("#reviewList");
    list.innerHTML = "";
    quizQuestions.forEach((q, i) => {
      const a = answers[i];
      const div = document.createElement("div");
      div.className = "review-item";
      const status = a
        ? a.isCorrect
          ? `<span class="ans correct">Your answer: ${escapeHtml(a.selected)} ✓</span>`
          : `<span class="ans wrong">Your answer: ${escapeHtml(a.selected || "(none)")} ✗</span><br/><span class="ans correct">Correct: ${escapeHtml(q.answer)}</span>`
        : `<span class="ans wrong">Not answered</span><br/><span class="ans correct">Correct: ${escapeHtml(q.answer)}</span>`;
      div.innerHTML = `
        <div class="q">${i + 1}. ${escapeHtml(q.question)}</div>
        ${status}
        <div class="expl">${escapeHtml(q.explanation)}</div>
      `;
      list.appendChild(div);
    });
    $("#reviewCard").style.display = "block";
    $("#reviewCard").scrollIntoView({ behavior: "smooth" });
  }

  // Event listeners
  $("#startBtn").addEventListener("click", startQuiz);
  $("#nextBtn").addEventListener("click", nextQuestion);
  $("#quitBtn").addEventListener("click", () => {
    if (confirm("Quit this quiz and return to the start screen?")) {
      if (timerInterval) clearInterval(timerInterval);
      showScreen("home");
    }
  });
  $("#restartBtn").addEventListener("click", () => showScreen("home"));
  $("#reviewBtn").addEventListener("click", showReview);

  // Init
  loadQuestions();
})();
