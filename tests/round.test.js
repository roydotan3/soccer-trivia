import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildRound, REGULAR_COUNT, HARD_COUNT } from "../game/js/round.js";

const bank = JSON.parse(readFileSync(new URL("./fixtures/sample-bank.json", import.meta.url)));

// Deterministic rng that always picks index 0 during Fisher-Yates — makes
// shuffle order predictable enough to reason about without caring about
// true randomness.
const zeroRng = () => 0;

test("returns exactly 10 questions: 7 regular + 3 hard", () => {
  const round = buildRound(bank, [], zeroRng);

  assert.equal(round.length, REGULAR_COUNT + HARD_COUNT);

  const byId = new Map(bank.map((q) => [q.id, q]));
  const regularCount = round.filter((q) => byId.get(q.id).difficulty === "regular").length;
  const hardCount = round.filter((q) => byId.get(q.id).difficulty === "hard").length;

  assert.equal(regularCount, REGULAR_COUNT);
  assert.equal(hardCount, HARD_COUNT);
});

test("every returned question's id exists in the input bank, no duplicate ids in the result", () => {
  const round = buildRound(bank, [], zeroRng);
  const bankIds = new Set(bank.map((q) => q.id));

  for (const q of round) {
    assert.ok(bankIds.has(q.id), `id "${q.id}" should exist in the bank`);
  }

  const resultIds = round.map((q) => q.id);
  assert.equal(new Set(resultIds).size, resultIds.length, "result ids should be unique");
});

test("every returned question has exactly 4 distinct option strings", () => {
  const round = buildRound(bank, [], zeroRng);

  for (const q of round) {
    assert.equal(q.options.length, 4);
    assert.equal(new Set(q.options).size, 4, `options for "${q.id}" should be distinct`);
  }
});

test("options[correctIndex] equals the bank question's original answer for every returned question", () => {
  const round = buildRound(bank, [], zeroRng);
  const byId = new Map(bank.map((q) => [q.id, q]));

  for (const q of round) {
    const original = byId.get(q.id);
    assert.equal(q.options[q.correctIndex], original.answer);
  }
});

test("prefers unseen ids: given seenIds covering all but one regular id, that one unseen id is always chosen over seen ones", () => {
  const regularIds = bank.filter((q) => q.difficulty === "regular").map((q) => q.id);
  const unseenId = regularIds[0];
  const seenIds = regularIds.slice(1); // every other regular id is "seen"

  const round = buildRound(bank, seenIds, zeroRng);
  const resultIds = round.map((q) => q.id);

  assert.ok(resultIds.includes(unseenId), "the one unseen regular id should always be selected");
});

test("falls back to seen ids once a bucket's unseen supply runs out: with all ids marked seen, still returns a full 7+3 without throwing", () => {
  const allIds = bank.map((q) => q.id);

  assert.doesNotThrow(() => buildRound(bank, allIds, zeroRng));

  const round = buildRound(bank, allIds, zeroRng);
  assert.equal(round.length, REGULAR_COUNT + HARD_COUNT);
});

test("throws when the bank has fewer than 7 regular or fewer than 3 hard questions", () => {
  const regularOnly = bank.filter((q) => q.difficulty === "regular").slice(0, 7);
  const hardOnly = bank.filter((q) => q.difficulty === "hard").slice(0, 3);

  // Missing hard questions entirely.
  assert.throws(() => buildRound(regularOnly, [], zeroRng));

  // Missing regular questions entirely.
  assert.throws(() => buildRound(hardOnly, [], zeroRng));

  // One short of each requirement.
  const tooFewRegular = [...regularOnly.slice(0, 6), ...hardOnly];
  const tooFewHard = [...regularOnly, ...hardOnly.slice(0, 2)];
  assert.throws(() => buildRound(tooFewRegular, [], zeroRng));
  assert.throws(() => buildRound(tooFewHard, [], zeroRng));
});
