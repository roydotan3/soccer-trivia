// The only module in the game allowed to touch localStorage — and even
// here only indirectly, through an injectable StorageLike object, so this
// module is unit-testable in plain Node. All reads/writes are wrapped in
// try/catch: a throwing storageImpl must never propagate, and malformed
// JSON read back from a key resets that key to its default.

import { isNewBest } from "./scoring.js";

const PREFIX = "soccer-trivia:v1:";
const KEYS = {
  name: `${PREFIX}name`,
  bests: `${PREFIX}bests`,
  stats: `${PREFIX}stats`,
  playedDates: `${PREFIX}played-dates`,
  seen: (topicId) => `${PREFIX}seen:${topicId}`,
};

const DEFAULT_STATS = { rounds: 0, correct: 0 };

// Formats a Date as "YYYY-MM-DD" using its local-time fields (not UTC).
export function todayLocalDateStr(d = new Date()) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Reads `key` and JSON.parses it, returning `fallback` if the key is
// missing, the storage read throws, or the stored value isn't valid JSON.
function readJSON(storage, key, fallback) {
  try {
    const raw = storage.getItem(key);
    if (raw === null || raw === undefined) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

// Writes `value` as JSON to `key`, silently dropping the write if the
// storage call throws.
function writeJSON(storage, key, value) {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // dropped
  }
}

export function createStore(storageImpl = globalThis.localStorage) {
  function getName() {
    try {
      const raw = storageImpl.getItem(KEYS.name);
      return raw === null || raw === undefined ? null : raw;
    } catch {
      return null;
    }
  }

  function setName(name) {
    try {
      storageImpl.setItem(KEYS.name, name);
    } catch {
      // dropped
    }
  }

  function getBests() {
    return readJSON(storageImpl, KEYS.bests, {});
  }

  function getBest(topicId) {
    const bests = getBests();
    const value = bests[topicId];
    return typeof value === "number" ? value : null;
  }

  function getStats() {
    const stats = readJSON(storageImpl, KEYS.stats, DEFAULT_STATS);
    const playedDates = readJSON(storageImpl, KEYS.playedDates, []);
    const days = Array.isArray(playedDates) ? new Set(playedDates).size : 0;
    return {
      rounds: typeof stats.rounds === "number" ? stats.rounds : 0,
      correct: typeof stats.correct === "number" ? stats.correct : 0,
      days,
    };
  }

  function getSeenIds(topicId) {
    const ids = readJSON(storageImpl, KEYS.seen(topicId), []);
    return Array.isArray(ids) ? ids : [];
  }

  function recordCompletedRound(topicId, { score, correctCount, allQuestionIds, dateStr } = {}) {
    // Update best.
    const bests = getBests();
    const previousBest = typeof bests[topicId] === "number" ? bests[topicId] : null;
    const becameNewBest = isNewBest(score, previousBest);
    const best = becameNewBest ? score : previousBest;
    bests[topicId] = best;
    writeJSON(storageImpl, KEYS.bests, bests);

    // Update rounds/correct totals.
    const stats = readJSON(storageImpl, KEYS.stats, DEFAULT_STATS);
    const nextStats = {
      rounds: (typeof stats.rounds === "number" ? stats.rounds : 0) + 1,
      correct: (typeof stats.correct === "number" ? stats.correct : 0) + (correctCount || 0),
    };
    writeJSON(storageImpl, KEYS.stats, nextStats);

    // Update distinct played dates.
    const effectiveDateStr = dateStr || todayLocalDateStr();
    const playedDates = readJSON(storageImpl, KEYS.playedDates, []);
    const dateSet = new Set(Array.isArray(playedDates) ? playedDates : []);
    dateSet.add(effectiveDateStr);
    writeJSON(storageImpl, KEYS.playedDates, [...dateSet]);

    // Merge seen question ids for this topic.
    const seen = new Set(getSeenIds(topicId));
    for (const id of allQuestionIds || []) seen.add(id);
    writeJSON(storageImpl, KEYS.seen(topicId), [...seen]);

    return { isNewBest: becameNewBest, best };
  }

  return {
    getName,
    setName,
    getBest,
    getStats,
    getSeenIds,
    recordCompletedRound,
  };
}
