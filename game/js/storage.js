// The only module in the game allowed to touch localStorage — and even
// here only indirectly, through an injectable StorageLike object, so this
// module is unit-testable in plain Node. All reads/writes are wrapped in
// try/catch: a throwing storageImpl must never propagate, malformed JSON
// read back from a key resets that key to its default, and a valid-but
// wrong-shaped value (e.g. "null" or "5" for an object key) is treated the
// same as malformed JSON. If the storage backend itself can't be used —
// access throws, or writes are silently dropped (quota, blocked storage,
// a sandboxed iframe) — the store falls back to an in-memory StorageLike
// for the rest of its lifetime so the game keeps working, just without
// persistence across reloads.

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

// A plain, non-null, non-array object — the shape bests/stats must have.
function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// Reads `key` and JSON.parses it, returning `fallback` if the key is
// missing, the storage read throws, the stored value isn't valid JSON, or
// (when `isValid` is given) the parsed value doesn't have the expected
// shape.
function readJSON(storage, key, fallback, isValid = () => true) {
  try {
    const raw = storage.getItem(key);
    if (raw === null || raw === undefined) return fallback;
    const parsed = JSON.parse(raw);
    return isValid(parsed) ? parsed : fallback;
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

// A minimal StorageLike backed by an in-memory Map, used whenever the real
// storage backend can't be trusted (inaccessible or write-dropping).
function makeMemoryStorage() {
  const map = new Map();
  return {
    getItem(key) {
      return map.has(key) ? map.get(key) : null;
    },
    setItem(key, value) {
      map.set(key, String(value));
    },
    removeItem(key) {
      map.delete(key);
    },
  };
}

// Probes `candidate` with a throwaway write + read-back + cleanup to detect
// a storage that accepts calls but doesn't actually persist them (e.g.
// QuotaExceeded swallowed by the host, or a no-op shim). Any throw here is
// left for the caller to catch.
function probeStorageWorks(candidate) {
  const probeKey = `${PREFIX}__probe__`;
  const probeValue = "1";
  candidate.setItem(probeKey, probeValue);
  const readBack = candidate.getItem(probeKey);
  candidate.removeItem(probeKey);
  return readBack === probeValue;
}

// Resolves the StorageLike to actually use: `storageImpl` if given, else
// `globalThis.localStorage` (read lazily, inside the try, since merely
// accessing it can throw in a locked-down browser). Falls back to an
// in-memory store on any access/probe failure.
function resolveStorage(storageImpl) {
  try {
    const candidate = storageImpl !== undefined ? storageImpl : globalThis.localStorage;
    if (!candidate || !probeStorageWorks(candidate)) {
      return makeMemoryStorage();
    }
    return candidate;
  } catch {
    return makeMemoryStorage();
  }
}

export function createStore(storageImpl) {
  const storage = resolveStorage(storageImpl);

  function getName() {
    try {
      const raw = storage.getItem(KEYS.name);
      return raw === null || raw === undefined ? null : raw;
    } catch {
      return null;
    }
  }

  function setName(name) {
    try {
      storage.setItem(KEYS.name, name);
    } catch {
      // dropped
    }
  }

  function getBests() {
    return readJSON(storage, KEYS.bests, {}, isPlainObject);
  }

  function getBest(topicId) {
    const bests = getBests();
    const value = bests[topicId];
    return typeof value === "number" ? value : null;
  }

  function getStats() {
    const stats = readJSON(storage, KEYS.stats, DEFAULT_STATS, isPlainObject);
    const playedDates = readJSON(storage, KEYS.playedDates, [], Array.isArray);
    const days = Array.isArray(playedDates) ? new Set(playedDates).size : 0;
    return {
      rounds: typeof stats.rounds === "number" ? stats.rounds : 0,
      correct: typeof stats.correct === "number" ? stats.correct : 0,
      days,
    };
  }

  function getSeenIds(topicId) {
    const ids = readJSON(storage, KEYS.seen(topicId), [], Array.isArray);
    return Array.isArray(ids) ? ids : [];
  }

  function recordCompletedRound(topicId, { score, correctCount, allQuestionIds, dateStr } = {}) {
    // Update best.
    const bests = getBests();
    const previousBest = typeof bests[topicId] === "number" ? bests[topicId] : null;
    const becameNewBest = isNewBest(score, previousBest);
    const best = becameNewBest ? score : previousBest;
    bests[topicId] = best;
    writeJSON(storage, KEYS.bests, bests);

    // Update rounds/correct totals.
    const stats = readJSON(storage, KEYS.stats, DEFAULT_STATS, isPlainObject);
    const nextStats = {
      rounds: (typeof stats.rounds === "number" ? stats.rounds : 0) + 1,
      correct: (typeof stats.correct === "number" ? stats.correct : 0) + (correctCount || 0),
    };
    writeJSON(storage, KEYS.stats, nextStats);

    // Update distinct played dates.
    const effectiveDateStr = dateStr || todayLocalDateStr();
    const playedDates = readJSON(storage, KEYS.playedDates, [], Array.isArray);
    const dateSet = new Set(Array.isArray(playedDates) ? playedDates : []);
    dateSet.add(effectiveDateStr);
    writeJSON(storage, KEYS.playedDates, [...dateSet]);

    // Merge seen question ids for this topic.
    const seen = new Set(getSeenIds(topicId));
    for (const id of allQuestionIds || []) seen.add(id);
    writeJSON(storage, KEYS.seen(topicId), [...seen]);

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
