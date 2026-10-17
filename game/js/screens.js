// Render functions for the 4 screens of the sticker-album game. Each takes
// (container, viewModel, callbacks) and replaces container's content with
// plain DOM — no fetch, no storage, no globals beyond `document`. Icons are
// inline stroke SVG (no emoji), per the direction-B visual tokens.

const INK = "#15172A";

function ballIcon() {
  return `<svg class="icon sticker-icon" viewBox="0 0 48 48" fill="none" stroke="${INK}" stroke-width="2.5" aria-hidden="true">
    <circle cx="24" cy="24" r="19" />
    <path d="M24 10 L32 16 L29 26 L19 26 L16 16 Z" stroke-linejoin="round" />
    <path d="M24 10 L24 4 M32 16 L41 13 M29 26 L35 35 M19 26 L13 35 M16 16 L7 13" stroke-linecap="round" />
  </svg>`;
}

function globeIcon() {
  return `<svg class="icon sticker-icon" viewBox="0 0 48 48" fill="none" stroke="${INK}" stroke-width="2.5" aria-hidden="true">
    <circle cx="24" cy="24" r="19" />
    <path d="M5 24 H43 M24 5 C30 5 34 14 34 24 C34 34 30 43 24 43 C18 43 14 34 14 24 C14 14 18 5 24 5 Z" />
  </svg>`;
}

function soonIcon() {
  return `<svg class="icon sticker-icon" viewBox="0 0 48 48" fill="none" stroke="${INK}" stroke-width="2.5" aria-hidden="true">
    <rect x="12" y="22" width="24" height="18" rx="3" />
    <path d="M17 22 V15 a7 7 0 0 1 14 0 v7" stroke-linecap="round" />
  </svg>`;
}

function closeIcon() {
  return `<svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
    <path d="M5 5 L19 19 M19 5 L5 19" />
  </svg>`;
}

function starIcon(filled) {
  const fill = filled ? "var(--yellow)" : "none";
  return `<svg class="icon star" viewBox="0 0 24 24" fill="${fill}" stroke="${INK}" stroke-width="1.5" aria-hidden="true">
    <path d="M12 2 L15 9 L22 9.5 L16.5 14 L18.5 21 L12 17 L5.5 21 L7.5 14 L2 9.5 L9 9 Z" stroke-linejoin="round" />
  </svg>`;
}

function iconForTopic(topicId) {
  return topicId === "world-cup" ? globeIcon() : ballIcon();
}

// ---------- Name screen ----------

export function renderNameScreen(container, _viewModel, { onSubmit }) {
  container.innerHTML = "";

  const screen = document.createElement("div");
  screen.className = "screen name-screen";

  const card = document.createElement("div");
  card.className = "name-card";

  const title = document.createElement("h1");
  title.textContent = "של מי האלבום הזה?";
  card.appendChild(title);

  const form = document.createElement("form");
  form.noValidate = true;

  const input = document.createElement("input");
  input.className = "name-input";
  input.type = "text";
  input.name = "name";
  input.placeholder = "השם שלך";
  input.autocomplete = "off";
  input.setAttribute("aria-label", "השם שלך");
  form.appendChild(input);

  const error = document.createElement("p");
  error.className = "field-error";
  error.setAttribute("role", "alert");
  form.appendChild(error);

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.className = "btn btn-primary btn-block";
  submitBtn.textContent = "פתח את האלבום";
  form.appendChild(submitBtn);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const trimmed = input.value.trim();
    if (trimmed.length === 0) {
      error.textContent = "צריך להקליד שם כדי לפתוח את האלבום";
      return;
    }
    if (trimmed.length > 20) {
      error.textContent = "השם יכול להיות עד 20 תווים";
      return;
    }
    error.textContent = "";
    onSubmit(trimmed);
  });

  card.appendChild(form);

  const trust = document.createElement("p");
  trust.className = "trust-line";
  trust.textContent = "בלי פרסומות · בלי הרשמה · שום מידע לא יוצא מהמכשיר";
  card.appendChild(trust);

  screen.appendChild(card);
  container.appendChild(screen);
}

// ---------- Home screen ----------

export function renderHomeScreen(container, { name, topics, stats }, { onPickTopic }) {
  container.innerHTML = "";

  const screen = document.createElement("div");
  screen.className = "screen home-screen";

  const header = document.createElement("div");
  header.className = "home-header";
  const greeting = document.createElement("h1");
  greeting.textContent = `שלום ${name}!`;
  header.appendChild(greeting);
  screen.appendChild(header);

  const grid = document.createElement("div");
  grid.className = "topic-grid";

  for (const topic of topics) {
    if (topic.status === "live") {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "sticker sticker-live";

      const iconWrap = document.createElement("span");
      iconWrap.innerHTML = iconForTopic(topic.id);
      btn.appendChild(iconWrap);

      const label = document.createElement("span");
      label.className = "sticker-label";
      label.textContent = topic.label;
      btn.appendChild(label);

      if (topic.sublabel) {
        const sublabel = document.createElement("span");
        sublabel.className = "sticker-sublabel";
        sublabel.textContent = topic.sublabel;
        btn.appendChild(sublabel);
      }

      const status = document.createElement("span");
      status.className = "sticker-status";
      if (typeof topic.best === "number") {
        status.innerHTML = `שיא <span class="ltr">${topic.best}/10</span>`;
      } else {
        status.textContent = "מדבקה חדשה מחכה";
      }
      btn.appendChild(status);

      btn.addEventListener("click", () => onPickTopic(topic.id));
      grid.appendChild(btn);
    } else {
      const slot = document.createElement("div");
      slot.className = "sticker sticker-soon";

      const iconWrap = document.createElement("span");
      iconWrap.innerHTML = soonIcon();
      slot.appendChild(iconWrap);

      const label = document.createElement("span");
      label.className = "sticker-label";
      label.textContent = topic.label;
      slot.appendChild(label);

      const status = document.createElement("span");
      status.className = "sticker-status";
      status.textContent = "בקרוב";
      slot.appendChild(status);

      grid.appendChild(slot);
    }
  }

  screen.appendChild(grid);

  const statsPanel = document.createElement("div");
  statsPanel.className = "stats-panel";

  const statEntries = [
    [stats.rounds, "סיבובים"],
    [stats.correct, "תשובות נכונות"],
    [stats.days, "ימי משחק"],
  ];
  for (const [value, labelText] of statEntries) {
    const stat = document.createElement("div");
    const valueEl = document.createElement("div");
    valueEl.className = "stat-value";
    valueEl.innerHTML = `<span class="ltr">${value}</span>`;
    const labelEl = document.createElement("div");
    labelEl.className = "stat-label";
    labelEl.textContent = labelText;
    stat.appendChild(valueEl);
    stat.appendChild(labelEl);
    statsPanel.appendChild(stat);
  }

  screen.appendChild(statsPanel);
  container.appendChild(screen);
}

// ---------- Question screen ----------

function showExitConfirm(mountEl, onExit) {
  const overlay = document.createElement("div");
  overlay.className = "exit-confirm-overlay";

  const card = document.createElement("div");
  card.className = "exit-confirm-card";

  const prompt = document.createElement("p");
  prompt.textContent = "לצאת? הסיבוב לא יישמר";
  card.appendChild(prompt);

  const actions = document.createElement("div");
  actions.className = "exit-confirm-actions";

  const cancelBtn = document.createElement("button");
  cancelBtn.type = "button";
  cancelBtn.className = "btn btn-secondary";
  cancelBtn.textContent = "להמשיך";
  cancelBtn.addEventListener("click", () => {
    overlay.remove();
  });

  const leaveBtn = document.createElement("button");
  leaveBtn.type = "button";
  leaveBtn.className = "btn btn-coral";
  leaveBtn.textContent = "לצאת";
  leaveBtn.addEventListener("click", () => {
    overlay.remove();
    onExit();
  });

  actions.appendChild(cancelBtn);
  actions.appendChild(leaveBtn);
  card.appendChild(actions);
  overlay.appendChild(card);
  mountEl.appendChild(overlay);

  cancelBtn.focus();
}

export function renderQuestionScreen(container, viewModel, { onSelect, onNext, onExit }) {
  const { index, total, difficulty, question, options, selectedIndex, correctIndex, detail, isAnswered } =
    viewModel;

  container.innerHTML = "";

  const screen = document.createElement("div");
  screen.className = "screen question-screen";

  // Header: exit button, progress, difficulty badge.
  const header = document.createElement("div");
  header.className = "question-header";

  const exitBtn = document.createElement("button");
  exitBtn.type = "button";
  exitBtn.className = "exit-btn";
  exitBtn.setAttribute("aria-label", "לצאת מהסיבוב");
  exitBtn.innerHTML = closeIcon();
  exitBtn.addEventListener("click", () => showExitConfirm(screen, onExit));
  header.appendChild(exitBtn);

  const progress = document.createElement("span");
  progress.className = "progress";
  progress.innerHTML = `<span class="ltr">${index + 1}/${total}</span>`;
  header.appendChild(progress);

  const badge = document.createElement("span");
  badge.className = `difficulty-badge ${difficulty === "hard" ? "difficulty-hard" : "difficulty-regular"}`;
  badge.textContent = difficulty === "hard" ? "קשה" : "רגיל";
  header.appendChild(badge);

  screen.appendChild(header);

  // Question card.
  const card = document.createElement("div");
  card.className = "question-card";
  const qText = document.createElement("p");
  qText.className = "question-text";
  qText.textContent = question;
  card.appendChild(qText);
  screen.appendChild(card);

  // Options.
  const list = document.createElement("ul");
  list.className = "options-list";

  options.forEach((optionText, i) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option-btn";
    btn.textContent = optionText;

    if (isAnswered) {
      btn.disabled = true;
      if (i === correctIndex) {
        btn.classList.add("option-correct");
      }
      if (i === selectedIndex && selectedIndex !== correctIndex) {
        btn.classList.add("option-wrong-pick");
        const tag = document.createElement("span");
        tag.className = "option-pick-tag";
        tag.textContent = "הבחירה שלך";
        btn.appendChild(tag);
      }
    } else {
      btn.addEventListener("click", () => onSelect(i));
    }

    li.appendChild(btn);
    list.appendChild(li);
  });

  screen.appendChild(list);

  if (isAnswered) {
    const isCorrect = selectedIndex === correctIndex;

    const note = document.createElement("div");
    note.className = `feedback-note ${isCorrect ? "feedback-correct" : "feedback-wrong"}`;

    const noteText = document.createElement("p");
    noteText.style.margin = "0";
    noteText.textContent = isCorrect ? "נכון!" : `לא הפעם! התשובה: ${options[correctIndex]}`;
    note.appendChild(noteText);

    const detailText = document.createElement("p");
    detailText.className = "feedback-detail";
    detailText.textContent = detail;
    note.appendChild(detailText);

    screen.appendChild(note);

    const nextRow = document.createElement("div");
    nextRow.className = "next-btn-row";
    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "btn btn-primary btn-block";
    nextBtn.textContent = index === total - 1 ? "לתוצאות" : "לשאלה הבאה";
    nextBtn.addEventListener("click", onNext);
    nextRow.appendChild(nextBtn);
    screen.appendChild(nextRow);
  }

  container.appendChild(screen);
}

// ---------- Results screen ----------

export function renderResultsScreen(
  container,
  { topicLabel, score, stars, isNewBest },
  { onPlayAgain, onChooseTopic },
) {
  container.innerHTML = "";

  const screen = document.createElement("div");
  screen.className = "screen results-screen";

  const card = document.createElement("div");
  card.className = "sticker-card";

  const label = document.createElement("p");
  label.className = "results-topic-label";
  label.textContent = topicLabel;
  card.appendChild(label);

  const scoreEl = document.createElement("div");
  scoreEl.className = "results-score";
  scoreEl.innerHTML = `<span class="ltr">${score}/10</span>`;
  card.appendChild(scoreEl);

  const starsRow = document.createElement("div");
  starsRow.className = "stars-row";
  for (let i = 0; i < 3; i++) {
    const starWrap = document.createElement("span");
    starWrap.innerHTML = starIcon(i < stars);
    starsRow.appendChild(starWrap);
  }
  card.appendChild(starsRow);

  if (stars === 0) {
    const miss = document.createElement("p");
    miss.className = "miss-banner";
    miss.textContent = "כמעט! נסה שוב";
    card.appendChild(miss);
  }

  if (isNewBest) {
    const stamp = document.createElement("div");
    stamp.className = "new-best-stamp";
    stamp.textContent = "שיא אישי חדש!";
    card.appendChild(stamp);
  }

  screen.appendChild(card);

  const actions = document.createElement("div");
  actions.className = "results-actions";

  const againBtn = document.createElement("button");
  againBtn.type = "button";
  againBtn.className = "btn btn-primary btn-block";
  againBtn.textContent = "עוד סיבוב";
  againBtn.addEventListener("click", onPlayAgain);
  actions.appendChild(againBtn);

  const homeBtn = document.createElement("button");
  homeBtn.type = "button";
  homeBtn.className = "btn btn-secondary btn-block";
  homeBtn.textContent = "חזרה לאלבום";
  homeBtn.addEventListener("click", onChooseTopic);
  actions.appendChild(homeBtn);

  screen.appendChild(actions);
  container.appendChild(screen);
}
