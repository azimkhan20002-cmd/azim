/* ============================================================
   SMARTER THAN YESTERDAY — app engine
   Router, state, voice lessons (en-GB), quizzes, flashcards,
   XP/streaks/badges. All state lives in localStorage.
   ============================================================ */

"use strict";

/* ---------------- state ---------------- */
const STORE_KEY = "sty-progress-v1";

const defaultState = () => ({
  completed: {},          // lessonId -> true
  quizBest: {},           // lessonId -> best score (0-3)
  actionsDone: {},        // lessonId -> true
  xp: 0,
  streak: { count: 0, last: null },
  cards: {},              // cardId -> {due, interval, reps}
  customCards: [],        // {id, front, back}
  reviews: 0,             // total flashcard reviews done
  badges: {}              // badgeId -> true
});

let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return Object.assign(defaultState(), JSON.parse(raw));
  } catch (e) { /* corrupted storage -> fresh start */ }
  return defaultState();
}
function saveState() { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }

/* ---------------- helpers ---------------- */
const $ = (sel, el) => (el || document).querySelector(sel);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const todayStr = () => new Date().toISOString().slice(0, 10);
const dayDiff = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000);

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("show"), 2600);
}

function confetti() {
  const colors = ["#6c8cff", "#b388ff", "#3ddc97", "#ffd166", "#ff8fa3", "#4cc9f0"];
  for (let i = 0; i < 60; i++) {
    const bit = document.createElement("div");
    bit.className = "confetti-bit";
    const size = 5 + Math.random() * 7;
    bit.style.cssText = `left:${Math.random() * 100}vw;width:${size}px;height:${size * (0.6 + Math.random())}px;background:${colors[i % colors.length]};`;
    document.body.appendChild(bit);
    bit.animate(
      [
        { transform: "translateY(0) rotate(0deg)", opacity: 1 },
        { transform: `translateY(${window.innerHeight + 40}px) rotate(${540 + Math.random() * 540}deg)`, opacity: 0.9 }
      ],
      { duration: 1600 + Math.random() * 1400, easing: "cubic-bezier(.2,.7,.4,1)" }
    ).onfinish = () => bit.remove();
  }
}

/* ---------------- XP / levels / badges ---------------- */
const LEVELS = ["Novice", "Apprentice", "Scholar", "Thinker", "Strategist", "Polymath", "Sage"];
function level() { return Math.min(LEVELS.length - 1, Math.floor(state.xp / 150)); }
function levelName() { return LEVELS[level()]; }

const BADGES = [
  { id: "first-lesson", icon: "🌱", name: "First Step", desc: "Complete your first lesson" },
  { id: "perfect-quiz", icon: "🎯", name: "Sharpshooter", desc: "Score 3/3 on any quiz" },
  { id: "streak-3", icon: "🔥", name: "Warming Up", desc: "Reach a 3-day streak" },
  { id: "streak-7", icon: "☄️", name: "On Fire", desc: "Reach a 7-day streak" },
  { id: "domain-done", icon: "🏰", name: "Domain Conquered", desc: "Complete every lesson in a domain" },
  { id: "halfway", icon: "⛰️", name: "Halfway Up", desc: "Complete 12 lessons" },
  { id: "graduate", icon: "🎓", name: "Smarter Than Yesterday", desc: "Complete all 24 lessons" },
  { id: "reviewer-10", icon: "🃏", name: "Memory Builder", desc: "Do 10 flashcard reviews" },
  { id: "card-maker", icon: "✍️", name: "Note Taker", desc: "Create your own flashcard" }
];

function addXP(n, reason) {
  state.xp += n;
  saveState();
  toast(`+${n} XP — ${reason}`);
  updateNavStat();
}

function earnBadge(id) {
  if (state.badges[id]) return;
  const b = BADGES.find(x => x.id === id);
  state.badges[id] = true;
  saveState();
  toast(`Badge earned: ${b.icon} ${b.name}`);
  confetti();
}

function checkBadges() {
  const doneCount = Object.keys(state.completed).length;
  if (doneCount >= 1) earnBadge("first-lesson");
  if (doneCount >= 12) earnBadge("halfway");
  if (doneCount >= COURSE.allLessons().length) earnBadge("graduate");
  for (const d of COURSE.domains) {
    if (d.lessons.every(l => state.completed[l.id])) { earnBadge("domain-done"); break; }
  }
  if (state.reviews >= 10) earnBadge("reviewer-10");
  if (state.customCards.length >= 1) earnBadge("card-maker");
  if (state.streak.count >= 3) earnBadge("streak-3");
  if (state.streak.count >= 7) earnBadge("streak-7");
}

function touchStreak() {
  const today = todayStr();
  if (state.streak.last === today) return;
  if (state.streak.last && dayDiff(state.streak.last, today) === 1) {
    state.streak.count += 1;
  } else {
    state.streak.count = 1;
  }
  state.streak.last = today;
  saveState();
  updateNavStat();
  checkBadges();
}

/* ---------------- voice lessons (British English only) ---------------- */
const Voice = {
  voices: [],
  current: null,   // SpeechSynthesisUtterance in flight
  supported: "speechSynthesis" in window,

  load() {
    if (!this.supported) return;
    const all = speechSynthesis.getVoices();
    this.voices = all
      .filter(v => v.lang && v.lang.replace("_", "-").toLowerCase().startsWith("en-gb"))
      .sort((a, b) => a.name.localeCompare(b.name));
  },

  init() {
    if (!this.supported) return;
    this.load();
    speechSynthesis.onvoiceschanged = () => this.load();
  },

  speak(text, voiceIndex, statusEl) {
    if (!this.supported) return;
    this.stop(true);
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-GB";
    if (this.voices[voiceIndex]) u.voice = this.voices[voiceIndex];
    u.rate = 0.96;
    u.pitch = 1.0;
    u.onstart = () => { statusEl.textContent = "Playing… listen actively — pause and summarise in your own head at the end."; statusEl.classList.add("speaking"); };
    u.onend = () => { statusEl.textContent = "Finished. Now: close your eyes and recall the three key points. That's retrieval practice working."; statusEl.classList.remove("speaking"); };
    u.onerror = () => { statusEl.textContent = "Playback stopped."; statusEl.classList.remove("speaking"); };
    this.current = u;
    speechSynthesis.speak(u);
  },

  pauseResume(statusEl) {
    if (!this.supported || !this.current) return;
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause();
      statusEl.textContent = "Paused.";
      statusEl.classList.remove("speaking");
    } else if (speechSynthesis.paused) {
      speechSynthesis.resume();
      statusEl.textContent = "Playing…";
      statusEl.classList.add("speaking");
    }
  },

  stop(silent) {
    if (!this.supported) return;
    speechSynthesis.cancel();
    this.current = null;
  }
};

function voiceBoxHTML(lesson) {
  if (!Voice.supported) {
    return `<div class="card voice-box"><h4>🔊 Voice lesson</h4>
      <p class="note">Your browser doesn't support speech synthesis. The script below is the full audio text — read it aloud yourself; speaking it is still retrieval practice.</p></div>`;
  }
  const options = Voice.voices.length
    ? Voice.voices.map((v, i) => `<option value="${i}">${esc(v.name)} (${esc(v.lang)})</option>`).join("")
    : `<option value="">No British voice found — browser default will try en-GB</option>`;
  return `
  <div class="card voice-box">
    <h4>🔊 Voice lesson — British accent only</h4>
    <p class="note">Nothing auto-plays, ever. Press play when you're ready. Only en-GB voices are listed.</p>
    <div class="voice-controls">
      <select class="voice-select" id="voice-select" aria-label="Choose a British English voice">${options}</select>
      <button class="btn primary small" id="voice-play">▶ Play</button>
      <button class="btn small" id="voice-pause">⏸ Pause / Resume</button>
      <button class="btn ghost small" id="voice-stop">⏹ Stop</button>
    </div>
    <p class="voice-status" id="voice-status"></p>
  </div>`;
}

function wireVoiceBox(lesson) {
  if (!Voice.supported) return;
  const statusEl = $("#voice-status");
  const select = $("#voice-select");
  $("#voice-play").addEventListener("click", () => Voice.speak(lesson.voice, select.value, statusEl));
  $("#voice-pause").addEventListener("click", () => Voice.pauseResume(statusEl));
  $("#voice-stop").addEventListener("click", () => { Voice.stop(); statusEl.textContent = "Stopped."; statusEl.classList.remove("speaking"); });
}

/* ---------------- flashcards (spaced repetition) ---------------- */
const SCHEDULE = [1, 3, 7, 16, 35]; // days

function builtinCards() {
  const cards = [];
  for (const { domain, lesson } of COURSE.allLessons()) {
    lesson.quiz.forEach((q, qi) => {
      cards.push({ id: `${lesson.id}-q${qi}`, front: `${q.q}`, back: `${q.options[q.answer]} — ${q.why}`, tag: `${domain.name} · ${lesson.title}` });
    });
  }
  return cards;
}
function allCards() {
  return builtinCards().concat(state.customCards.map(c => ({ id: c.id, front: c.front, back: c.back, tag: "Your card" })));
}
function cardState(id) { return state.cards[id] || { due: todayStr(), interval: 0, reps: 0 }; }
function dueCards() {
  const today = todayStr();
  return allCards().filter(c => cardState(c.id).due <= today);
}

/* ---------------- router ---------------- */
const routes = {
  "": renderHome,
  "domains": renderDomains,
  "domain": renderDomain,
  "lesson": renderLesson,
  "quiz": renderQuiz,
  "flashcards": renderFlashcards,
  "roadmap": renderRoadmap,
  "science": renderScience,
  "progress": renderProgress,
  "guide": renderGuide
};

function router() {
  Voice.stop(true);
  const hash = location.hash.replace(/^#\/?/, "");
  const [name, arg] = hash.split("/");
  const view = $("#view");
  window.scrollTo(0, 0);
  (routes[name] || renderHome)(view, arg);
  document.querySelectorAll(".nav-links a").forEach(a => {
    a.classList.toggle("active", a.getAttribute("href") === `#/${name || ""}` || (name === "" && a.getAttribute("href") === "#/"));
  });
}

function updateNavStat() {
  const el = $("#nav-stat");
  if (el) el.textContent = `🔥 ${state.streak.count} · ${levelName()} · ${state.xp} XP`;
}

/* ---------------- views ---------------- */
function renderHome(view) {
  const totalLessons = COURSE.allLessons().length;
  const doneCount = Object.keys(state.completed).length;
  const totalQ = builtinCards().length;
  const first = COURSE.domains[0].lessons[0];
  view.innerHTML = `
    <section class="hero">
      <span class="eyebrow">${esc(COURSE.subtitle)}</span>
      <h1>${esc(COURSE.title)}</h1>
      <p class="lead">An interactive course in becoming measurably sharper — how to learn, think, earn, decide, connect, and master AI — engineered around the science of how brains actually change.</p>
      <div class="btn-row" style="justify-content:center">
        <a class="btn primary" href="#/lesson/${first.id}">▶ Start lesson 1</a>
        <a class="btn" href="#/roadmap">🗺️ See the roadmap</a>
        <a class="btn ghost" href="#/guide">📖 How to use this</a>
      </div>
      <div class="hero-stats">
        <div class="hstat"><b>6</b><span>Domains</span></div>
        <div class="hstat"><b>${totalLessons}</b><span>Lessons</span></div>
        <div class="hstat"><b>${totalQ}</b><span>Quiz questions</span></div>
        <div class="hstat"><b>🇬🇧</b><span>British voice lessons</span></div>
        <div class="hstat"><b>${doneCount}</b><span>Done by you</span></div>
      </div>
    </section>

    <div class="section-head"><h2>The six domains</h2><p>Each domain is a pillar of practical intelligence. Complete lessons, pass quizzes, and lock knowledge in with spaced-repetition flashcards.</p></div>
    <div class="grid three" id="home-domains"></div>

    <div class="callout blue mt"><b>Why this works:</b> every lesson ends with retrieval practice (a quiz), a real-world action, and cards that reappear just before you'd forget them. You're not reading a course — you're running a training programme. <a href="#/science" style="color:var(--brand)">See the science &amp; the honest numbers →</a></div>
  `;
  const grid = $("#home-domains");
  grid.innerHTML = COURSE.domains.map(d => domainCardHTML(d)).join("");
  grid.querySelectorAll(".domain-card").forEach((el, i) => el.addEventListener("click", () => location.hash = `#/domain/${COURSE.domains[i].id}`));
}

function domainCardHTML(d) {
  const done = d.lessons.filter(l => state.completed[l.id]).length;
  const pct = Math.round((done / d.lessons.length) * 100);
  return `
    <div class="card hoverable domain-card">
      <div class="glow" style="background:${d.color}"></div>
      <div class="icon">${d.icon}</div>
      <h3>${esc(d.name)}</h3>
      <p>${esc(d.tagline)}</p>
      <div class="progress-line"><i style="width:${pct}%;background:${d.color}"></i></div>
      <div class="domain-meta"><span>${d.lessons.length} lessons</span><span>${done}/${d.lessons.length} done</span></div>
    </div>`;
}

function renderDomains(view) {
  view.innerHTML = `
    <div class="section-head"><h2>Course domains</h2><p>Six pillars. Twenty-four lessons. One sharper Azim.</p></div>
    <div class="grid two" id="domains-grid"></div>`;
  const grid = $("#domains-grid");
  grid.innerHTML = COURSE.domains.map(d => domainCardHTML(d)).join("");
  grid.querySelectorAll(".domain-card").forEach((el, i) => el.addEventListener("click", () => location.hash = `#/domain/${COURSE.domains[i].id}`));
}

function renderDomain(view, id) {
  const d = COURSE.findDomain(id);
  if (!d) return renderDomains(view);
  const done = d.lessons.filter(l => state.completed[l.id]).length;
  view.innerHTML = `
    <div class="lesson-head">
      <div class="crumbs"><a href="#/domains">Course</a> / ${esc(d.name)}</div>
      <h1>${d.icon} ${esc(d.name)}</h1>
      <p class="hook">${esc(d.tagline)}</p>
      <div class="meta"><span class="chip accent">${done}/${d.lessons.length} complete</span><span class="chip">~${d.lessons.reduce((s, l) => s + l.minutes, 0)} min total</span></div>
    </div>
    <div id="lesson-list"></div>`;
  $("#lesson-list").innerHTML = d.lessons.map((l, i) => {
    const isDone = !!state.completed[l.id];
    const best = state.quizBest[l.id];
    return `
    <div class="lesson-row ${isDone ? "done" : ""}" data-id="${l.id}">
      <div class="num">${i + 1}</div>
      <div class="info"><b>${esc(l.title)}</b><span>${l.minutes} min · ${l.ideas.length} key ideas · ${l.quiz.length} quiz questions${best != null ? ` · best quiz ${best}/${l.quiz.length}` : ""}</span></div>
      <div class="state">${isDone ? "✅" : "○"}</div>
    </div>`;
  }).join("");
  view.querySelectorAll(".lesson-row").forEach(el => el.addEventListener("click", () => location.hash = `#/lesson/${el.dataset.id}`));
}

function renderLesson(view, id) {
  const found = COURSE.findLesson(id);
  if (!found) return renderDomains(view);
  const { domain: d, lesson: l } = found;
  const idx = d.lessons.indexOf(l);
  const next = d.lessons[idx + 1];
  const isDone = !!state.completed[l.id];

  view.innerHTML = `
    <div class="lesson-head">
      <div class="crumbs"><a href="#/domains">Course</a> / <a href="#/domain/${d.id}">${esc(d.name)}</a> / Lesson ${idx + 1}</div>
      <h1>${esc(l.title)}</h1>
      <p class="hook">"${esc(l.hook)}"</p>
      <div class="meta">
        <span class="chip">⏱ ${l.minutes} min</span>
        <span class="chip">🇬🇧 British voice lesson</span>
        ${isDone ? '<span class="chip accent">✓ Completed</span>' : ""}
      </div>
    </div>

    ${voiceBoxHTML(l)}

    <div class="section-head"><h2>Key ideas</h2></div>
    <div class="card">
      ${l.ideas.map(i => `<div class="idea" style="border-color:${d.color}"><h4>${esc(i.h)}</h4><p>${esc(i.b)}</p></div>`).join("")}
    </div>

    <div class="action-box">
      <h4>⚡ Do it today — this is the actual lesson</h4>
      <p>${esc(l.action)}</p>
      <div class="mt">
        <button class="btn small ${state.actionsDone[l.id] ? "" : "primary"}" id="action-btn">
          ${state.actionsDone[l.id] ? "✓ Done — nice work" : "Mark as done (+15 XP)"}
        </button>
      </div>
    </div>

    <div class="btn-row mt">
      <a class="btn primary" href="#/quiz/${l.id}">🧪 Take the quiz ${state.quizBest[l.id] != null ? `(best: ${state.quizBest[l.id]}/${l.quiz.length})` : ""}</a>
      ${!isDone ? `<button class="btn" id="complete-btn">✓ Mark lesson complete (+25 XP)</button>` : ""}
      ${next ? `<a class="btn ghost" href="#/lesson/${next.id}">Next: ${esc(next.title)} →</a>` : `<a class="btn ghost" href="#/domain/${d.id}">Back to ${esc(d.name)} →</a>`}
    </div>`;

  wireVoiceBox(l);

  $("#action-btn").addEventListener("click", () => {
    if (state.actionsDone[l.id]) return toast("Already done — you're ahead of the game.");
    state.actionsDone[l.id] = true;
    touchStreak();
    saveState();
    addXP(15, "real-world action completed");
    renderLesson(view, id);
  });

  const completeBtn = $("#complete-btn");
  if (completeBtn) completeBtn.addEventListener("click", () => {
    state.completed[l.id] = true;
    touchStreak();
    saveState();
    checkBadges();
    addXP(25, "lesson complete");
    confetti();
    renderLesson(view, id);
  });
}

/* ---------------- quiz ---------------- */
function renderQuiz(view, lessonId) {
  const found = COURSE.findLesson(lessonId);
  if (!found) return renderDomains(view);
  const { domain: d, lesson: l } = found;
  let current = 0, score = 0;

  function renderQ() {
    const q = l.quiz[current];
    view.innerHTML = `
      <div class="lesson-head">
        <div class="crumbs"><a href="#/lesson/${l.id}">${esc(l.title)}</a> / Quiz</div>
        <h1>🧪 ${esc(l.title)}</h1>
        <div class="meta"><span class="chip accent">Question ${current + 1} of ${l.quiz.length}</span><span class="chip">Score: ${score}</span></div>
      </div>
      <div class="card">
        <div class="quiz-q">
          <h4><span class="qn">Q${current + 1}.</span>${esc(q.q)}</h4>
          <div id="opts">
            ${q.options.map((o, i) => `<button class="opt" data-i="${i}">${esc(o)}</button>`).join("")}
          </div>
          <div id="why-slot"></div>
        </div>
        <div class="btn-row"><button class="btn primary hidden" id="next-btn">${current + 1 < l.quiz.length ? "Next question →" : "See results"}</button></div>
      </div>`;

    view.querySelectorAll(".opt").forEach(btn => btn.addEventListener("click", () => {
      const picked = Number(btn.dataset.i);
      const right = picked === q.answer;
      if (right) score++;
      view.querySelectorAll(".opt").forEach(b => {
        b.disabled = true;
        const bi = Number(b.dataset.i);
        if (bi === q.answer) b.classList.add("correct");
        else if (bi === picked) b.classList.add("wrong");
        else b.classList.add("dim");
      });
      $("#why-slot").innerHTML = `<div class="why">${right ? "✅ <b>Correct.</b> " : "❌ <b>Not quite.</b> "}${esc(q.why)}</div>`;
      $("#next-btn").classList.remove("hidden");
      // a review counts as flashcard exposure for scheduling
      markCardReviewed(`${l.id}-q${l.quiz.indexOf(q)}`, right);
    }));

    $("#next-btn").addEventListener("click", () => {
      current++;
      if (current < l.quiz.length) renderQ(); else renderResult();
    });
  }

  function renderResult() {
    const prev = state.quizBest[l.id];
    const isBest = prev == null || score > prev;
    if (isBest) state.quizBest[l.id] = score;
    const passed = score >= Math.ceil(l.quiz.length * 0.66);
    if (passed) {
      touchStreak();
      if (isBest) addXP(score * 10, `quiz ${score}/${l.quiz.length}`);
      if (score === l.quiz.length) { earnBadge("perfect-quiz"); }
    }
    saveState();
    if (score === l.quiz.length) confetti();
    const pct = Math.round((score / l.quiz.length) * 100);
    view.innerHTML = `
      <div class="card quiz-result">
        <div class="big" style="color:${passed ? "var(--good)" : "var(--warn)"}">${score}/${l.quiz.length}</div>
        <p class="sub">${pct}% — ${passed ? (score === l.quiz.length ? "Perfect. That's mastery." : "Passed. The wrong ones are now flashcards — review will fix them.") : "Not yet. Reread the key ideas and retake — struggle is the learning."}</p>
        <div class="btn-row" style="justify-content:center">
          <a class="btn" href="#/lesson/${l.id}">← Back to lesson</a>
          <button class="btn ghost" id="retake-btn">↻ Retake quiz</button>
          ${!state.completed[l.id] ? `<button class="btn primary" id="complete-btn">✓ Mark lesson complete (+25 XP)</button>` : `<a class="btn primary" href="#/flashcards">🃏 Review flashcards</a>`}
        </div>
      </div>`;
    $("#retake-btn").addEventListener("click", () => { current = 0; score = 0; renderQ(); });
    const cb = $("#complete-btn");
    if (cb) cb.addEventListener("click", () => {
      state.completed[l.id] = true;
      touchStreak(); saveState(); checkBadges();
      addXP(25, "lesson complete");
      confetti();
      renderQuiz(view, lessonId);
    });
  }

  renderQ();
}

/* ---------------- flashcards ---------------- */
function markCardReviewed(cardId, known) {
  const cs = cardState(cardId);
  const today = todayStr();
  if (known) {
    cs.interval = Math.min(SCHEDULE.length - 1, cs.interval + 1);
  } else {
    cs.interval = 0;
  }
  cs.reps += 1;
  const days = SCHEDULE[cs.interval];
  const due = new Date();
  due.setDate(due.getDate() + (known ? days : 0));
  cs.due = due.toISOString().slice(0, 10);
  state.cards[cardId] = cs;
  state.reviews += 1;
  saveState();
}

function renderFlashcards(view) {
  const due = dueCards();
  let i = 0, known = 0, total = due.length;

  function renderSession() {
    if (i >= total) {
      touchStreak();
      if (total > 0) { addXP(10, "review session complete"); }
      return view.innerHTML = `
        <div class="card quiz-result">
          <div class="big">🎉</div>
          <h2 style="margin-bottom:8px">Deck clear.</h2>
          <p class="sub">${total ? `You reviewed ${total} card${total > 1 ? "s" : ""} and knew ${known}. Spaced repetition is now working for you in the background.` : "Nothing due right now. Every card is safely in future-you's hands."}</p>
          <div class="btn-row" style="justify-content:center">
            <a class="btn" href="#/domains">Back to course</a>
            <button class="btn ghost" id="add-card-btn2">✍️ Add a custom card</button>
          </div>
        </div>`;
    }
    const card = due[i];
    view.innerHTML = `
      <div class="section-head"><h2>🃏 Flashcard review</h2><p>Card ${i + 1} of ${total}. Answer honestly — cards you miss come back sooner. That's the algorithm doing its job.</p></div>
      <div class="flashcard" id="fc">
        <div class="inner">
          <div class="face front"><div><div class="tag">${esc(card.tag)}</div><div class="content">${esc(card.front)}</div></div></div>
          <div class="face back"><div><div class="tag">Answer</div><div class="content">${esc(card.back)}</div></div></div>
        </div>
      </div>
      <p class="flash-hint">Click the card to reveal the answer</p>
      <div class="review-btns hidden" id="review-btns">
        <button class="btn" id="again-btn">😬 Didn't know it</button>
        <button class="btn primary" id="known-btn">✅ Knew it</button>
      </div>`;
    $("#fc").addEventListener("click", () => {
      $("#fc").classList.toggle("flipped");
      if ($("#fc").classList.contains("flipped")) $("#review-btns").classList.remove("hidden");
    });
    $("#again-btn").addEventListener("click", () => { markCardReviewed(card.id, false); i++; renderSession(); });
    $("#known-btn").addEventListener("click", () => { markCardReviewed(card.id, true); known++; i++; renderSession(); });
  }

  // entry screen
  const totalCards = allCards().length;
  view.innerHTML = `
    <div class="section-head"><h2>🃏 Flashcards</h2><p>Spaced repetition: cards return just as you're about to forget them (1 → 3 → 7 → 16 → 35 days). Every quiz question you meet automatically becomes a card.</p></div>
    <div class="stat-grid">
      <div class="card stat-box"><b>${due.length}</b><span>Due today</span></div>
      <div class="card stat-box"><b>${totalCards}</b><span>Total cards</span></div>
      <div class="card stat-box"><b>${state.reviews}</b><span>Reviews done</span></div>
    </div>
    <div class="btn-row">
      <button class="btn primary" id="start-review" ${due.length ? "" : "disabled"}>▶ Start review (${due.length} due)</button>
      <button class="btn" id="add-card-btn">✍️ Add a custom card</button>
    </div>
    <div id="custom-card-form" class="card mt hidden">
      <h4 style="margin-bottom:12px">New flashcard</h4>
      <input id="cc-front" placeholder="Front — the question or cue" style="width:100%;margin-bottom:10px;padding:12px;border-radius:10px;border:1px solid var(--stroke-strong);background:var(--bg-2);color:var(--text);font-family:var(--font)">
      <input id="cc-back" placeholder="Back — the answer" style="width:100%;margin-bottom:12px;padding:12px;border-radius:10px;border:1px solid var(--stroke-strong);background:var(--bg-2);color:var(--text);font-family:var(--font)">
      <button class="btn primary small" id="cc-save">Save card</button>
    </div>`;

  $("#start-review").addEventListener("click", renderSession);
  const toggleForm = () => $("#custom-card-form").classList.toggle("hidden");
  $("#add-card-btn").addEventListener("click", toggleForm);
  $("#cc-save").addEventListener("click", () => {
    const front = $("#cc-front").value.trim(), back = $("#cc-back").value.trim();
    if (!front || !back) return toast("Both sides of the card need content.");
    state.customCards.push({ id: "custom-" + Date.now(), front, back });
    saveState(); checkBadges();
    toast("Card added — it's due today.");
    renderFlashcards(view);
  });
}

/* ---------------- roadmap ---------------- */
function renderRoadmap(view) {
  const weeks = [];
  COURSE.domains.forEach((d, di) => {
    d.lessons.forEach((l, li) => {
      const wk = di * 4 + li + 1; // 24 lessons -> 24 weeks max
      weeks.push({ wk, d, l });
    });
  });
  view.innerHTML = `
    <div class="section-head"><h2>🗺️ The 24-week roadmap</h2><p>One lesson per week is the sustainable pace — 20 minutes of learning plus one real-world action. Faster is allowed; slower is fine. Consistency is the whole game. <a href="roadmap.html" style="color:var(--brand)" target="_blank" rel="noopener">Open printable version ↗</a></p></div>
    <div class="grid two">
      ${COURSE.domains.map((d, di) => `
        <div class="card">
          <h3 style="margin-bottom:4px">${d.icon} ${esc(d.name)}</h3>
          <p class="text-dim" style="font-size:0.84rem;margin-bottom:14px">Weeks ${di * 4 + 1}–${di * 4 + d.lessons.length}</p>
          ${d.lessons.map((l, li) => `
            <div class="lesson-row ${state.completed[l.id] ? "done" : ""}" data-id="${l.id}" style="margin-bottom:8px">
              <div class="num" style="font-size:0.7rem">W${di * 4 + li + 1}</div>
              <div class="info"><b style="font-size:0.88rem">${esc(l.title)}</b></div>
              <div class="state" style="font-size:0.9rem">${state.completed[l.id] ? "✅" : ""}</div>
            </div>`).join("")}
        </div>`).join("")}
    </div>
    <div class="section-head"><h2>The operating rhythm</h2><p>How a week on this course actually runs.</p></div>
    <div class="card">
      <div class="phase"><div class="when">Daily — 5 min</div><h3>Flashcard review</h3><ul><li>Clear cards that are due. That's it. The algorithm handles the schedule.</li></ul></div>
      <div class="phase"><div class="when">Once a week — 20 min</div><h3>One lesson</h3><ul><li>Read the key ideas (or press play on the British voice lesson)</li><li>Take the quiz — struggle is the point</li><li>Do the real-world action and mark it done</li></ul></div>
      <div class="phase"><div class="when">Weekly — 10 min</div><h3>Review your progress</h3><ul><li>Check streak, XP and domain bars on the Progress screen</li><li>Add one custom flashcard from your own life</li></ul></div>
    </div>`;
  view.querySelectorAll(".lesson-row").forEach(el => el.addEventListener("click", () => location.hash = `#/lesson/${el.dataset.id}`));
}

/* ---------------- science & quantification ---------------- */
function renderScience(view) {
  view.innerHTML = `
    <div class="section-head"><h2>📈 The science — and the honest numbers</h2><p>You asked how much smarter this will truly make you. Here is the evidence-based answer, with no motivational padding.</p></div>

    <div class="callout"><b>The honest headline:</b> no course can raise raw IQ by a fixed number of points, and anyone who promises that is selling something. What CAN be measurably improved — by a lot — is the set of skills, knowledge and habits that determine how intelligent you are in practice: memory, learning speed, decision quality, financial judgement, social effectiveness, and AI leverage. That's what this course trains.</div>

    <div class="card mb">
      <table class="clean">
        <tr><th>Capacity</th><th>What the evidence says</th><th>Realistic gain from this course</th></tr>
        <tr><td>Retention of what you learn</td><td>Retrieval practice + spaced repetition roughly double long-term retention vs rereading (Dunlosky et al., 2013; Roediger &amp; Karpicke, 2006)</td><td>~2× more of what you study actually sticks</td></tr>
        <tr><td>Learning new skills</td><td>Deliberate practice is the strongest known predictor of expertise (Ericsson)</td><td>A repeatable method, usable on any skill, forever</td></tr>
        <tr><td>Decision quality</td><td>Structured decision habits (pre-mortems, base rates, expected value) measurably reduce judgement errors</td><td>Fewer expensive mistakes; several big ones avoided per decade is life-changing</td></tr>
        <tr><td>Financial outcomes</td><td>Starting investing at 25 vs 35 can ~2× end wealth at identical contributions (compounding arithmetic)</td><td>Potentially the highest £-per-hour ratio of anything you'll ever learn</td></tr>
        <tr><td>Focus &amp; output</td><td>Deep work + attention-residue research: single-tasking blocks can roughly double effective cognitively-demanding output</td><td>~2× output on your most important work</td></tr>
        <tr><td>AI leverage</td><td>Studies of professionals using AI well show large productivity gains on writing, analysis and coding tasks</td><td>Top-decile AI usage vs. average — a durable career edge</td></tr>
        <tr><td>Wellbeing &amp; energy</td><td>Sleep consistency, exercise and stress-recovery practices have among the largest effect sizes in health psychology</td><td>More good hours per day — the multiplier on everything else</td></tr>
      </table>
    </div>

    <div class="section-head"><h2>How your growth is measured here</h2></div>
    <div class="card">
      <ul style="list-style:none">
        <li style="padding:8px 0"><b>🧪 Quiz scores</b> — retrieval practice doubles as measurement: you can see yourself going from 1/3 to 3/3 per lesson.</li>
        <li style="padding:8px 0"><b>🃏 Retention rate</b> — your flashcard "knew it" percentage over time is a direct, honest measure of what's sticking.</li>
        <li style="padding:8px 0"><b>🔥 Streak &amp; XP</b> — process metrics. Consistency is the leading indicator; everything else lags it by weeks.</li>
        <li style="padding:8px 0"><b>⚡ Actions done</b> — the only metric that ultimately matters: how much of this you applied to real life.</li>
      </ul>
    </div>

    <div class="callout blue mt"><b>The compounding claim you can bank:</b> if this course makes you 1% more effective per week for 24 weeks, that's not 24% — compounded, it's roughly 27% and accelerating, because every mental model makes the next one easier to learn. The truthful promise is not "genius in 24 weeks." It's: a permanently better operating system, installed one upgrade at a time.</div>`;
}

/* ---------------- progress ---------------- */
function renderProgress(view) {
  const total = COURSE.allLessons().length;
  const done = Object.keys(state.completed).length;
  const actions = Object.keys(state.actionsDone).length;
  const quizTaken = Object.keys(state.quizBest).length;
  const avgQuiz = quizTaken ? (Object.values(state.quizBest).reduce((a, b) => a + b, 0) / quizTaken / 3 * 100).toFixed(0) : 0;

  view.innerHTML = `
    <div class="section-head"><h2>📊 Your progress</h2><p>Process metrics: the honest numbers behind getting smarter.</p></div>
    <div class="stat-grid">
      <div class="card stat-box"><b>${state.xp}</b><span>Total XP</span></div>
      <div class="card stat-box"><b>${levelName()}</b><span>Level</span></div>
      <div class="card stat-box"><b>${state.streak.count}🔥</b><span>Day streak</span></div>
      <div class="card stat-box"><b>${done}/${total}</b><span>Lessons</span></div>
      <div class="card stat-box"><b>${avgQuiz}%</b><span>Avg quiz</span></div>
      <div class="card stat-box"><b>${actions}</b><span>Actions done</span></div>
      <div class="card stat-box"><b>${state.reviews}</b><span>Reviews</span></div>
    </div>

    <div class="section-head"><h2>Domains</h2></div>
    <div class="grid two mb">
      ${COURSE.domains.map(d => {
        const dd = d.lessons.filter(l => state.completed[l.id]).length;
        const pct = Math.round(dd / d.lessons.length * 100);
        return `<div class="card"><h3 style="font-size:1rem;margin-bottom:10px">${d.icon} ${esc(d.name)}</h3>
          <div class="progress-line"><i style="width:${pct}%;background:${d.color}"></i></div>
          <div class="domain-meta"><span>${dd}/${d.lessons.length}</span><span>${pct}%</span></div></div>`;
      }).join("")}
    </div>

    <div class="section-head"><h2>Badges</h2></div>
    <div class="grid three mb">
      ${BADGES.map(b => `<div class="badge ${state.badges[b.id] ? "" : "locked"}"><div class="bicon">${b.icon}</div><div><b>${esc(b.name)}</b><span>${esc(b.desc)}</span></div></div>`).join("")}
    </div>

    <div class="btn-row mt">
      <button class="btn" id="export-btn">⬇ Export progress (CSV)</button>
      <button class="btn ghost" id="reset-btn">🗑 Reset everything</button>
    </div>`;

  $("#export-btn").addEventListener("click", () => {
    const rows = [["lesson_id", "domain", "title", "completed", "best_quiz", "action_done"]];
    for (const { domain, lesson } of COURSE.allLessons()) {
      rows.push([lesson.id, domain.name, lesson.title, state.completed[lesson.id] ? "yes" : "no", state.quizBest[lesson.id] ?? "", state.actionsDone[lesson.id] ? "yes" : "no"]);
    }
    rows.push([]);
    rows.push(["xp", state.xp], ["streak_days", state.streak.count], ["reviews", state.reviews]);
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "smarter-than-yesterday-progress.csv";
    a.click();
    URL.revokeObjectURL(a.href);
    toast("Progress exported.");
  });

  $("#reset-btn").addEventListener("click", () => {
    if (!confirm("Reset all progress, XP, streaks and flashcards? This cannot be undone.")) return;
    localStorage.removeItem(STORE_KEY);
    state = defaultState();
    saveState();
    updateNavStat();
    toast("Fresh start. Day one again.");
    renderProgress(view);
  });
}

/* ---------------- guide ---------------- */
function renderGuide(view) {
  view.innerHTML = `
    <div class="section-head"><h2>📖 How to use this course</h2><p>Everything you need to get the full effect, in five minutes.</p></div>

    <div class="card mb">
      <h3 style="margin-bottom:10px">🚀 Start here (your first 15 minutes)</h3>
      <ul style="list-style:none">
        <li style="padding:6px 0">1. Open <a href="#/lesson/mind-1" style="color:var(--brand)">Lesson 1: How Learning Actually Works</a> — it teaches the method the whole course is built on.</li>
        <li style="padding:6px 0">2. Read the key ideas, or press <b>▶ Play</b> on the voice lesson — British accent, and it only plays when you press it.</li>
        <li style="padding:6px 0">3. Take the quiz. Getting questions wrong is not failing — it's the mechanism.</li>
        <li style="padding:6px 0">4. Do the "Do it today" action and mark it done. That's where the course becomes real.</li>
        <li style="padding:6px 0">5. Come back tomorrow and clear your flashcards. Streak started. 🔥</li>
      </ul>
    </div>

    <div class="grid two mb">
      <div class="card">
        <h3 style="margin-bottom:10px">🔊 About the voice lessons</h3>
        <p class="text-dim" style="font-size:0.92rem">Every lesson has a full audio version using only <b>British English (en-GB)</b> voices — no other accents are listed, ever. Nothing auto-plays: you always press play. Pick your favourite British voice from the selector once and it stays put. If your device has no British voice installed, the selector will tell you honestly instead of sneaking in another accent.</p>
      </div>
      <div class="card">
        <h3 style="margin-bottom:10px">🃏 Why flashcards matter most</h3>
        <p class="text-dim" style="font-size:0.92rem">Lessons teach you once; flashcards make it permanent. Every quiz question you answer becomes a card, scheduled to reappear after 1, 3, 7, 16 then 35 days — just as you'd forget it. Five minutes a day. This is the single highest-leverage habit in the course.</p>
      </div>
      <div class="card">
        <h3 style="margin-bottom:10px">📅 The rhythm that works</h3>
        <p class="text-dim" style="font-size:0.92rem">Daily: 5 minutes of flashcards. Weekly: one lesson + quiz + its real-world action. That's the <a href="#/roadmap" style="color:var(--brand)">24-week roadmap</a>. Faster is allowed, but never sacrifice the daily review — spacing is what makes memory permanent.</p>
      </div>
      <div class="card">
        <h3 style="margin-bottom:10px">📊 Your data</h3>
        <p class="text-dim" style="font-size:0.92rem">All progress lives only in your browser's localStorage — private by design, no accounts, no servers. Export it as CSV anytime from the Progress screen. Clear your browser data and it resets, so export occasionally if that matters to you.</p>
      </div>
    </div>

    <div class="callout"><b>One rule above all:</b> never miss twice. Miss a day — fine, life happens. Miss two and the habit dies. Fall off, get back on, keep the votes coming. (That's lesson life-2. You'll see.)</div>`;
}

/* ---------------- boot ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  Voice.init();
  updateNavStat();
  window.addEventListener("hashchange", router);
  router();
});
