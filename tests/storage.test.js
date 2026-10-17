import { test } from "node:test";
import assert from "node:assert/strict";
import { createStore, todayLocalDateStr } from "../game/js/storage.js";

// A Map-backed fake implementing the StorageLike shape (getItem/setItem/removeItem).
function makeFakeStorage() {
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

// A storage-like whose every method throws, to prove Store never propagates.
function makeThrowingStorage() {
  return {
    getItem() {
      throw new Error("getItem boom");
    },
    setItem() {
      throw new Error("setItem boom");
    },
    removeItem() {
      throw new Error("removeItem boom");
    },
  };
}

// A storage-like that returns non-JSON garbage for one specific key, and
// otherwise behaves like a normal in-memory fake.
function makeGarbageStorage(garbageKey) {
  const map = new Map();
  return {
    getItem(key) {
      if (key === garbageKey) return "{not valid json!!";
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

test("getName/setName round-trip through the storage object", () => {
  const store = createStore(makeFakeStorage());
  store.setName("Roy");
  assert.equal(store.getName(), "Roy");
});

test("getName returns null when nothing is stored", () => {
  const store = createStore(makeFakeStorage());
  assert.equal(store.getName(), null);
});

test("getBest returns null for a topic with no recorded rounds", () => {
  const store = createStore(makeFakeStorage());
  assert.equal(store.getBest("premier-league"), null);
});

test("recordCompletedRound sets isNewBest true and updates getBest on the first round for a topic, even with score 0", () => {
  const store = createStore(makeFakeStorage());
  const result = store.recordCompletedRound("premier-league", {
    score: 0,
    correctCount: 0,
    allQuestionIds: ["q1", "q2"],
    dateStr: "2026-10-17",
  });
  assert.equal(result.isNewBest, true);
  assert.equal(result.best, 0);
  assert.equal(store.getBest("premier-league"), 0);
});

test("recordCompletedRound: a later lower or equal score does not change getBest and reports isNewBest false", () => {
  const store = createStore(makeFakeStorage());
  store.recordCompletedRound("premier-league", {
    score: 7,
    correctCount: 7,
    allQuestionIds: ["q1"],
    dateStr: "2026-10-17",
  });
  const equalResult = store.recordCompletedRound("premier-league", {
    score: 7,
    correctCount: 7,
    allQuestionIds: ["q2"],
    dateStr: "2026-10-18",
  });
  assert.equal(equalResult.isNewBest, false);
  assert.equal(equalResult.best, 7);
  const lowerResult = store.recordCompletedRound("premier-league", {
    score: 3,
    correctCount: 3,
    allQuestionIds: ["q3"],
    dateStr: "2026-10-19",
  });
  assert.equal(lowerResult.isNewBest, false);
  assert.equal(lowerResult.best, 7);
  assert.equal(store.getBest("premier-league"), 7);
});

test("recordCompletedRound twice with the same dateStr: getStats().days is 1", () => {
  const store = createStore(makeFakeStorage());
  store.recordCompletedRound("premier-league", {
    score: 5,
    correctCount: 5,
    allQuestionIds: ["q1"],
    dateStr: "2026-10-17",
  });
  store.recordCompletedRound("champions-league", {
    score: 6,
    correctCount: 6,
    allQuestionIds: ["q2"],
    dateStr: "2026-10-17",
  });
  assert.equal(store.getStats().days, 1);
});

test("recordCompletedRound with two different dateStr values: getStats().days is 2", () => {
  const store = createStore(makeFakeStorage());
  store.recordCompletedRound("premier-league", {
    score: 5,
    correctCount: 5,
    allQuestionIds: ["q1"],
    dateStr: "2026-10-17",
  });
  store.recordCompletedRound("premier-league", {
    score: 6,
    correctCount: 6,
    allQuestionIds: ["q2"],
    dateStr: "2026-10-18",
  });
  assert.equal(store.getStats().days, 2);
});

test("getStats().rounds and .correct accumulate across multiple recordCompletedRound calls", () => {
  const store = createStore(makeFakeStorage());
  store.recordCompletedRound("premier-league", {
    score: 5,
    correctCount: 5,
    allQuestionIds: ["q1"],
    dateStr: "2026-10-17",
  });
  store.recordCompletedRound("champions-league", {
    score: 8,
    correctCount: 8,
    allQuestionIds: ["q2"],
    dateStr: "2026-10-18",
  });
  const stats = store.getStats();
  assert.equal(stats.rounds, 2);
  assert.equal(stats.correct, 13);
});

test("getSeenIds reflects allQuestionIds merged in by prior recordCompletedRound calls for that topic, deduplicated", () => {
  const store = createStore(makeFakeStorage());
  store.recordCompletedRound("premier-league", {
    score: 5,
    correctCount: 5,
    allQuestionIds: ["q1", "q2"],
    dateStr: "2026-10-17",
  });
  store.recordCompletedRound("premier-league", {
    score: 6,
    correctCount: 6,
    allQuestionIds: ["q2", "q3"],
    dateStr: "2026-10-18",
  });
  const seen = store.getSeenIds("premier-league");
  assert.deepEqual([...seen].sort(), ["q1", "q2", "q3"]);
});

test("getSeenIds returns an empty list for a topic with no recorded rounds", () => {
  const store = createStore(makeFakeStorage());
  assert.deepEqual(store.getSeenIds("premier-league"), []);
});

test("a throwing storageImpl: every Store method returns its default and never throws", () => {
  const store = createStore(makeThrowingStorage());
  assert.doesNotThrow(() => {
    assert.equal(store.getName(), null);
    store.setName("Roy");
    assert.equal(store.getBest("premier-league"), null);
    assert.deepEqual(store.getStats(), { rounds: 0, correct: 0, days: 0 });
    assert.deepEqual(store.getSeenIds("premier-league"), []);
    const result = store.recordCompletedRound("premier-league", {
      score: 5,
      correctCount: 5,
      allQuestionIds: ["q1"],
      dateStr: "2026-10-17",
    });
    assert.equal(result.isNewBest, true);
    assert.equal(result.best, 5);
  });
});

test("a storageImpl returning garbage JSON for a key: the affected read falls back to its default instead of throwing", () => {
  const store = createStore(makeGarbageStorage("soccer-trivia:v1:stats"));
  assert.doesNotThrow(() => {
    assert.deepEqual(store.getStats(), { rounds: 0, correct: 0, days: 0 });
  });
  // other keys still work normally
  store.setName("Roy");
  assert.equal(store.getName(), "Roy");
});

test("todayLocalDateStr formats a given Date as YYYY-MM-DD in local time", () => {
  const d = new Date(2026, 9, 17, 23, 59); // month is 0-indexed: October 17 2026, local time
  assert.equal(todayLocalDateStr(d), "2026-10-17");
});

test("todayLocalDateStr pads single-digit months and days", () => {
  const d = new Date(2026, 0, 5, 0, 0); // January 5 2026, local time
  assert.equal(todayLocalDateStr(d), "2026-01-05");
});
