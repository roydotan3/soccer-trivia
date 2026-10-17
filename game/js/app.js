// The conductor: a small state machine wiring storage, round-building,
// scoring and the DOM render functions together. The only module besides
// storage.js that reads game state across screens; it never touches
// localStorage directly (that's storage.js's job exclusively).

import { TOPICS } from "./topics.js";
import { buildRound } from "./round.js";
import { starsForScore } from "./scoring.js";
import { createStore } from "./storage.js";
import {
  renderNameScreen,
  renderHomeScreen,
  renderQuestionScreen,
  renderResultsScreen,
} from "./screens.js";

// Bump this when a data file's content changes, so phones don't serve a
// stale cached copy of game/data/<topic>.json.
const DATA_VERSION = "1";

const container = document.getElementById("app");
const store = createStore();

// In-memory round state. Nothing here is persisted directly — only
// store.recordCompletedRound() (storage.js) writes to localStorage.
const state = {
  topicId: null,
  bank: null,
  round: null,
  index: 0,
  selectedIndex: null,
  isAnswered: false,
  correctCount: 0,
  previousBest: null,
};

function resetRoundState() {
  state.topicId = null;
  state.bank = null;
  state.round = null;
  state.index = 0;
  state.selectedIndex = null;
  state.isAnswered = false;
  state.correctCount = 0;
  state.previousBest = null;
}

function showName() {
  renderNameScreen(container, {}, {
    onSubmit(name) {
      store.setName(name);
      showHome();
    },
  });
}

function showHome() {
  const topics = TOPICS.map((topic) => ({
    ...topic,
    best: topic.status === "live" ? store.getBest(topic.id) : null,
    playable: topic.status === "live",
  }));

  renderHomeScreen(
    container,
    { name: store.getName(), topics, stats: store.getStats() },
    {
      onPickTopic(topicId) {
        pickTopic(topicId);
      },
    },
  );
}

function showLoadFailure() {
  container.innerHTML = "";
  const screen = document.createElement("div");
  screen.className = "screen load-failure";

  const message = document.createElement("p");
  message.textContent = "לא הצלחנו לטעון שאלות — נסו לרענן";
  screen.appendChild(message);

  const backBtn = document.createElement("button");
  backBtn.type = "button";
  backBtn.className = "btn btn-secondary";
  backBtn.textContent = "חזרה לאלבום";
  backBtn.addEventListener("click", () => {
    resetRoundState();
    showHome();
  });
  screen.appendChild(backBtn);

  container.appendChild(screen);
}

async function pickTopic(topicId) {
  const topic = TOPICS.find((t) => t.id === topicId);
  if (!topic || topic.status !== "live" || !topic.dataFile) return;

  try {
    const response = await fetch(`${topic.dataFile}?v=${DATA_VERSION}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const bank = await response.json();
    if (!Array.isArray(bank) || bank.length === 0) throw new Error("empty bank");

    state.topicId = topicId;
    state.bank = bank;
    state.previousBest = store.getBest(topicId);
    startRound();
  } catch {
    showLoadFailure();
  }
}

function startRound() {
  state.round = buildRound(state.bank, store.getSeenIds(state.topicId));
  state.index = 0;
  state.selectedIndex = null;
  state.isAnswered = false;
  state.correctCount = 0;
  renderQuestion();
}

function renderQuestion() {
  const current = state.round[state.index];

  renderQuestionScreen(
    container,
    {
      index: state.index,
      total: state.round.length,
      difficulty: current.difficulty,
      question: current.question,
      options: current.options,
      selectedIndex: state.selectedIndex,
      correctIndex: current.correctIndex,
      detail: current.detail,
      isAnswered: state.isAnswered,
    },
    {
      onSelect(i) {
        handleSelect(i);
      },
      onNext() {
        handleNext();
      },
      onExit() {
        handleExit();
      },
    },
  );
}

function handleSelect(i) {
  if (state.isAnswered) return;
  state.selectedIndex = i;
  state.isAnswered = true;
  const current = state.round[state.index];
  if (i === current.correctIndex) {
    state.correctCount += 1;
  }
  renderQuestion();
}

function handleNext() {
  const isLast = state.index === state.round.length - 1;
  if (!isLast) {
    state.index += 1;
    state.selectedIndex = null;
    state.isAnswered = false;
    renderQuestion();
    return;
  }
  finishRound();
}

function handleExit() {
  // Leaving mid-round never records the round — just go home.
  resetRoundState();
  showHome();
}

function finishRound() {
  const topicId = state.topicId;
  const allQuestionIds = state.round.map((q) => q.id);
  const score = state.correctCount;

  const { isNewBest, best } = store.recordCompletedRound(topicId, {
    score,
    correctCount: state.correctCount,
    allQuestionIds,
  });

  const topic = TOPICS.find((t) => t.id === topicId);

  renderResultsScreen(
    container,
    {
      topicLabel: topic ? topic.label : "",
      score,
      stars: starsForScore(score),
      isNewBest,
      previousBest: state.previousBest,
      best,
    },
    {
      onPlayAgain() {
        startRound();
      },
      onChooseTopic() {
        resetRoundState();
        showHome();
      },
    },
  );
}

function init() {
  if (store.getName()) {
    showHome();
  } else {
    showName();
  }
}

init();
