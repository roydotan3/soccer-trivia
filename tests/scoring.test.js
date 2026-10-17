import { test } from "node:test";
import assert from "node:assert/strict";
import { starsForScore, isNewBest } from "../game/js/scoring.js";

test("starsForScore: 0-3 -> 0", () => {
  assert.equal(starsForScore(0), 0);
  assert.equal(starsForScore(1), 0);
  assert.equal(starsForScore(3), 0);
});

test("starsForScore: 4-6 -> 1", () => {
  assert.equal(starsForScore(4), 1);
  assert.equal(starsForScore(6), 1);
});

test("starsForScore: 7-8 -> 2", () => {
  assert.equal(starsForScore(7), 2);
  assert.equal(starsForScore(8), 2);
});

test("starsForScore: 9-10 -> 3", () => {
  assert.equal(starsForScore(9), 3);
  assert.equal(starsForScore(10), 3);
});

test("isNewBest: null previousBest is always beaten, including score 0", () => {
  assert.equal(isNewBest(0, null), true);
  assert.equal(isNewBest(5, null), true);
  assert.equal(isNewBest(10, null), true);
});

test("isNewBest: true only when score is strictly greater than previousBest", () => {
  assert.equal(isNewBest(7, 6), true);
  assert.equal(isNewBest(10, 0), true);
});

test("isNewBest: false when score equals or is less than previousBest", () => {
  assert.equal(isNewBest(6, 6), false);
  assert.equal(isNewBest(5, 6), false);
  assert.equal(isNewBest(0, 3), false);
});
