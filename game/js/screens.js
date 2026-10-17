// Render functions for the 4 screens of the sticker-album game. Each takes
// (container, viewModel, callbacks) and replaces container's content with
// plain DOM — no fetch, no storage, no globals beyond `document`. Icons are
// inline stroke SVG (no emoji), matching the approved canvas mockups
// (B-Home.dc.html, B-Question.dc.html, B-Results.dc.html).

const INK = "#15172A";

function ballIcon(size = 54) {
  return `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9"></circle>
    <path d="M12 7l4 3-1.5 4.5h-5L8 10z"></path>
    <path d="M12 7V3M16 10l4-1.5M14.5 14.5l2.5 3.5M9.5 14.5L7 18M8 10L4 8.5" stroke-linecap="round"></path>
  </svg>`;
}

function globeIcon(size = 54) {
  return `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
    <circle cx="12" cy="12" r="9"></circle>
    <path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"></path>
  </svg>`;
}

function closeIcon() {
  return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18"></path>
  </svg>`;
}

function checkIcon() {
  return `<svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5"></path>
  </svg>`;
}

function nextArrowIcon() {
  return `<svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M15 6l-6 6 6 6"></path>
  </svg>`;
}

const STAR_PATH = "M12 2.8l2.8 5.8 6.4.9-4.6 4.5 1.1 6.3L12 17.3l-5.7 3 1.1-6.3L2.8 9.5l6.4-.9z";

// `variant` is "mini" (home topic card, 16px, plain outline when empty) or
// "big" (results screen, 40px, dashed grey outline when empty).
function starIcon(filled, variant, size) {
  if (filled) {
    return `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="#FFC62E" stroke="${INK}" stroke-width="${variant === "big" ? 1.4 : 1.5}" stroke-linejoin="round" aria-hidden="true"><path d="${STAR_PATH}"></path></svg>`;
  }
  if (variant === "big") {
    return `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="#FFFFFF" stroke="#9A9789" stroke-width="1.4" stroke-linejoin="round" stroke-dasharray="2 2" aria-hidden="true"><path d="${STAR_PATH}"></path></svg>`;
  }
  return `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${INK}" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true"><path d="${STAR_PATH}"></path></svg>`;
}

// Live topics get a fixed icon + icon-band color per the mockup (coral band
// + white ball icon for israeli-football, yellow band + ink globe icon for
// world-cup).
function bandForTopic(topicId) {
  if (topicId === "world-cup") {
    return { bandClass: "sticker-icon-band--yellow", icon: globeIcon() };
  }
  return { bandClass: "sticker-icon-band--coral", icon: ballIcon() };
}

// ---------- Name screen ----------

export function renderNameScreen(container, _viewModel, { onSubmit }) {
  container.innerHTML = "";
  container.classList.remove("app-cobalt");

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
  submitBtn.className = "btn";
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
  container.classList.remove("app-cobalt");

  const screen = document.createElement("div");
  screen.className = "screen home-screen";

  // Header band: badge + season, greeting, big headline.
  const header = document.createElement("div");
  header.className = "home-header";

  const headerTop = document.createElement("div");
  headerTop.className = "home-header-top";

  const badge = document.createElement("span");
  badge.className = "home-badge";
  badge.textContent = "טריוויה כדורגל";
  headerTop.appendChild(badge);

  const season = document.createElement("span");
  season.className = "home-season";
  season.textContent = "עונת 2026/27";
  headerTop.appendChild(season);

  header.appendChild(headerTop);

  const greeting = document.createElement("div");
  greeting.className = "home-greeting";
  greeting.textContent = `שלום ${name}!`;
  header.appendChild(greeting);

  const headline = document.createElement("h1");
  headline.className = "home-headline";
  headline.textContent = `האלבום של ${name}`;
  header.appendChild(headline);

  screen.appendChild(header);

  // Subheader row.
  const subheader = document.createElement("div");
  subheader.className = "home-subheader";
  const subheaderTitle = document.createElement("h2");
  subheaderTitle.textContent = "בחר עמוד ושחק";
  subheader.appendChild(subheaderTitle);
  const subheaderNote = document.createElement("span");
  subheaderNote.className = "home-subheader-note";
  subheaderNote.textContent = "10 שאלות בסיבוב";
  subheader.appendChild(subheaderNote);
  screen.appendChild(subheader);

  // Live topic cards.
  const grid = document.createElement("div");
  grid.className = "topic-grid";

  const liveTopics = topics.filter((t) => t.status === "live");
  const soonTopics = topics.filter((t) => t.status !== "live");

  for (const topic of liveTopics) {
    const { bandClass, icon } = bandForTopic(topic.id);

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "sticker-live";

    const band = document.createElement("span");
    band.className = `sticker-icon-band ${bandClass}`;
    band.innerHTML = icon;
    btn.appendChild(band);

    const body = document.createElement("span");
    body.className = "sticker-body";

    const title = document.createElement("span");
    title.className = "sticker-title";
    title.textContent = topic.label;
    body.appendChild(title);

    if (typeof topic.best === "number") {
      const bestRow = document.createElement("span");
      bestRow.className = "sticker-best-row";
      for (let i = 0; i < 3; i++) {
        const starWrap = document.createElement("span");
        starWrap.innerHTML = starIcon(i < topic.bestStars, "mini", 16);
        bestRow.appendChild(starWrap);
      }
      const bestLabel = document.createElement("span");
      bestLabel.className = "sticker-best-label";
      bestLabel.innerHTML = `שיא <span class="ltr">${topic.best}/10</span>`;
      bestRow.appendChild(bestLabel);
      body.appendChild(bestRow);
    } else {
      const newLabel = document.createElement("span");
      newLabel.className = "sticker-new";
      newLabel.textContent = "מדבקה חדשה מחכה";
      body.appendChild(newLabel);
    }

    btn.appendChild(body);
    btn.addEventListener("click", () => onPickTopic(topic.id));
    grid.appendChild(btn);
  }

  screen.appendChild(grid);

  // "Coming soon" dashed slots, numbered on from the live topics.
  const soonGrid = document.createElement("div");
  soonGrid.className = "soon-grid";

  soonTopics.forEach((topic, i) => {
    const slot = document.createElement("div");
    slot.className = "sticker-soon";

    const number = document.createElement("span");
    number.className = "sticker-soon-number";
    number.textContent = String(liveTopics.length + i + 1).padStart(2, "0");
    slot.appendChild(number);

    const label = document.createElement("span");
    label.className = "sticker-soon-label";
    label.textContent = topic.label;
    slot.appendChild(label);

    const status = document.createElement("span");
    status.className = "sticker-soon-status";
    status.textContent = "בקרוב";
    slot.appendChild(status);

    soonGrid.appendChild(slot);
  });

  screen.appendChild(soonGrid);

  // Stats panel.
  const statsPanel = document.createElement("div");
  statsPanel.className = "stats-panel";

  const statEntries = [
    [stats.rounds, "סיבובים", "stat-value--blue"],
    [stats.correct, "תשובות נכונות", "stat-value--coral"],
    [stats.days, "ימי משחק", "stat-value--ink"],
  ];
  for (const [value, labelText, colorClass] of statEntries) {
    const col = document.createElement("div");
    col.className = "stat-col";
    const valueEl = document.createElement("div");
    valueEl.className = `stat-value ${colorClass}`;
    valueEl.innerHTML = `<span class="ltr">${value}</span>`;
    const labelEl = document.createElement("div");
    labelEl.className = "stat-label";
    labelEl.textContent = labelText;
    col.appendChild(valueEl);
    col.appendChild(labelEl);
    statsPanel.appendChild(col);
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
  const {
    index,
    total,
    difficulty,
    question,
    options,
    selectedIndex,
    correctIndex,
    detail,
    isAnswered,
    answers,
  } = viewModel;

  container.innerHTML = "";
  container.classList.remove("app-cobalt");

  const screen = document.createElement("div");
  screen.className = "screen question-screen";

  // Header: exit button + per-question progress dots.
  const header = document.createElement("div");
  header.className = "question-header";

  const exitBtn = document.createElement("button");
  exitBtn.type = "button";
  exitBtn.className = "exit-btn";
  exitBtn.setAttribute("aria-label", "חזרה לאלבום");
  exitBtn.innerHTML = closeIcon();
  exitBtn.addEventListener("click", () => showExitConfirm(screen, onExit));
  header.appendChild(exitBtn);

  const dots = document.createElement("div");
  dots.className = "progress-dots";
  dots.setAttribute("role", "img");
  dots.setAttribute("aria-label", `התקדמות: שאלה ${index + 1} מתוך ${total}`);

  const answerStatuses = Array.isArray(answers) ? answers : [];
  for (let i = 0; i < total; i++) {
    const dot = document.createElement("span");
    const status = answerStatuses[i];
    let stateClass = "progress-dot--unanswered";
    if (status === true) stateClass = "progress-dot--correct";
    else if (status === false) stateClass = "progress-dot--wrong";
    dot.className = `progress-dot ${stateClass}`;
    dots.appendChild(dot);
  }
  header.appendChild(dots);

  screen.appendChild(header);

  // Question card.
  const card = document.createElement("div");
  card.className = "question-card";

  const badges = document.createElement("div");
  badges.className = "question-badges";

  const progressBadge = document.createElement("span");
  progressBadge.className = "badge-progress";
  progressBadge.innerHTML = `שאלה <span class="ltr">${index + 1}/${total}</span>`;
  badges.appendChild(progressBadge);

  const difficultyBadge = document.createElement("span");
  difficultyBadge.className = "badge-difficulty";
  difficultyBadge.textContent = difficulty === "hard" ? "קשה" : "רגיל";
  badges.appendChild(difficultyBadge);

  card.appendChild(badges);

  const qText = document.createElement("h1");
  qText.className = "question-text";
  qText.textContent = question;
  card.appendChild(qText);

  screen.appendChild(card);

  // Options, 2x2 grid.
  const list = document.createElement("ul");
  list.className = "options-grid";

  options.forEach((optionText, i) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option-btn";

    if (isAnswered) {
      btn.disabled = true;
      const isCorrectOption = i === correctIndex;
      const isWrongPick = i === selectedIndex && selectedIndex !== correctIndex;
      const isNeutral = !isCorrectOption && !isWrongPick;

      if (isCorrectOption) {
        btn.classList.add("option-correct");
        const checkWrap = document.createElement("span");
        checkWrap.innerHTML = checkIcon();
        btn.appendChild(checkWrap);
      }
      if (isWrongPick) {
        btn.classList.add("option-wrong-pick");
      }
      if (isNeutral) {
        btn.classList.add("option-neutral");
      }

      const label = document.createElement("span");
      label.textContent = optionText;
      btn.appendChild(label);

      if (isWrongPick) {
        const tag = document.createElement("span");
        tag.className = "option-pick-tag";
        tag.textContent = "הבחירה שלך";
        btn.appendChild(tag);
      }
    } else {
      btn.textContent = optionText;
      btn.addEventListener("click", () => onSelect(i));
    }

    li.appendChild(btn);
    list.appendChild(li);
  });

  screen.appendChild(list);

  if (isAnswered) {
    const isCorrect = selectedIndex === correctIndex;

    const note = document.createElement("div");
    note.className = "feedback-note";

    const noteTitle = document.createElement("div");
    noteTitle.className = `feedback-title ${isCorrect ? "feedback-title--correct" : "feedback-title--wrong"}`;
    noteTitle.textContent = isCorrect ? "נכון!" : `לא הפעם! התשובה: ${options[correctIndex]}`;
    note.appendChild(noteTitle);

    const detailText = document.createElement("div");
    detailText.className = "feedback-detail";
    detailText.textContent = detail;
    note.appendChild(detailText);

    screen.appendChild(note);

    const nextRow = document.createElement("div");
    nextRow.className = "next-btn-row";
    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "btn";
    const isLast = index === total - 1;
    const nextLabel = document.createElement("span");
    nextLabel.textContent = isLast ? "לתוצאות" : "לשאלה הבאה";
    nextBtn.appendChild(nextLabel);
    const arrowWrap = document.createElement("span");
    arrowWrap.innerHTML = nextArrowIcon();
    nextBtn.appendChild(arrowWrap);
    nextBtn.addEventListener("click", onNext);
    nextRow.appendChild(nextBtn);
    screen.appendChild(nextRow);
  }

  container.appendChild(screen);
}

// ---------- Results screen ----------

export function renderResultsScreen(
  container,
  { name, topicLabel, score, stars, isNewBest, previousBest },
  { onPlayAgain, onChooseTopic },
) {
  container.innerHTML = "";
  container.classList.add("app-cobalt");

  const screen = document.createElement("div");
  screen.className = "screen results-screen";

  const sunburst = document.createElement("div");
  sunburst.className = "results-sunburst";
  sunburst.setAttribute("aria-hidden", "true");
  screen.appendChild(sunburst);

  const intro = document.createElement("div");
  intro.className = "results-intro";
  intro.textContent = `סיימת סיבוב, ${name}!`;
  screen.appendChild(intro);

  const headline = document.createElement("h1");
  headline.className = "results-headline";
  headline.textContent = "קיבלת מדבקה!";
  screen.appendChild(headline);

  const card = document.createElement("div");
  card.className = "sticker-card";

  const label = document.createElement("div");
  label.className = "results-topic-label";
  label.textContent = topicLabel;
  card.appendChild(label);

  const scoreWrap = document.createElement("div");
  scoreWrap.className = "results-score-wrap";

  const scoreEl = document.createElement("div");
  scoreEl.className = "results-score";
  scoreEl.innerHTML = `<span class="ltr">${score}/10</span>`;
  scoreWrap.appendChild(scoreEl);

  const starsRow = document.createElement("div");
  starsRow.className = "stars-row";
  starsRow.setAttribute("role", "img");
  starsRow.setAttribute("aria-label", `${stars} כוכבים מתוך 3`);
  for (let i = 0; i < 3; i++) {
    const starWrap = document.createElement("span");
    starWrap.innerHTML = starIcon(i < stars, "big", 40);
    starsRow.appendChild(starWrap);
  }
  scoreWrap.appendChild(starsRow);

  card.appendChild(scoreWrap);
  screen.appendChild(card);

  if (stars === 0) {
    const miss = document.createElement("p");
    miss.className = "miss-banner";
    miss.textContent = "כמעט! נסה שוב";
    screen.appendChild(miss);
  }

  if (isNewBest) {
    const stamp = document.createElement("div");
    stamp.className = "new-best-stamp";
    stamp.textContent = "שיא אישי חדש!";
    screen.appendChild(stamp);

    // Only meaningful when there WAS a previous best to beat — the very
    // first completed round on a topic has nothing to compare against.
    if (typeof previousBest === "number") {
      const previousBestLine = document.createElement("div");
      previousBestLine.className = "results-previous-best";
      previousBestLine.innerHTML = `השיא הקודם שלך: <span class="ltr">${previousBest}/10</span>`;
      screen.appendChild(previousBestLine);
    }
  }

  const actions = document.createElement("div");
  actions.className = "results-actions";

  const againBtn = document.createElement("button");
  againBtn.type = "button";
  againBtn.className = "btn";
  againBtn.textContent = "עוד סיבוב";
  againBtn.addEventListener("click", onPlayAgain);
  actions.appendChild(againBtn);

  const homeBtn = document.createElement("button");
  homeBtn.type = "button";
  homeBtn.className = "btn btn-secondary";
  homeBtn.textContent = "חזרה לאלבום";
  homeBtn.addEventListener("click", onChooseTopic);
  actions.appendChild(homeBtn);

  screen.appendChild(actions);
  container.appendChild(screen);
}
