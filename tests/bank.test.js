import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { validateBank } from "../tools/validate-bank.js";

const dataPath = (name) => fileURLToPath(new URL(`../game/data/${name}`, import.meta.url));
const loadBank = (name) => JSON.parse(readFileSync(dataPath(name), "utf8"));

// A well-formed question. Tests override single fields to break exactly one rule.
const good = (overrides = {}) => ({
  id: "q1",
  topic: "league",
  difficulty: "regular",
  question: "Which club won the league in 2025?",
  answer: "A",
  distractors: ["B", "C", "D"],
  detail: "Short fact explaining the answer.",
  source: "https://one.co.il/example",
  asOf: "2026-10",
  ...overrides,
});

// Two regular + one hard, checked against expected counts of 2 and 1.
const opts = { expectedRegular: 2, expectedHard: 1 };

test("flags a question missing a required field", () => {
  const missing = good({ id: "b" });
  delete missing.detail;
  const bank = [good({ id: "a" }), missing, good({ id: "c", difficulty: "hard" })];

  const result = validateBank(bank, opts);

  assert.equal(result.valid, false);
  assert.equal(result.errors.length, 1);
  assert.match(result.errors[0], /detail/);
});

test("flags a duplicate id across the bank", () => {
  const bank = [good({ id: "a" }), good({ id: "a" }), good({ id: "c", difficulty: "hard" })];

  const result = validateBank(bank, opts);

  assert.equal(result.valid, false);
  assert.equal(result.errors.length, 1);
  assert.match(result.errors[0], /duplicate id/);
});

test("flags distractors that duplicate each other or the answer", () => {
  const bank = [
    good({ id: "a", distractors: ["X", "X", "D"] }),
    good({ id: "b", answer: "Y", distractors: ["Y", "C", "D"] }),
    good({ id: "c", difficulty: "hard" }),
  ];

  const result = validateBank(bank, opts);

  assert.equal(result.valid, false);
  assert.equal(result.errors.length, 2);
});

test("flags a source that is not a URL", () => {
  const bank = [good({ id: "a" }), good({ id: "b", source: "one.co.il" }), good({ id: "c", difficulty: "hard" })];

  const result = validateBank(bank, opts);

  assert.equal(result.valid, false);
  assert.equal(result.errors.length, 1);
  assert.match(result.errors[0], /source/);
});

test("flags an asOf that is not YYYY-MM", () => {
  const bank = [good({ id: "a" }), good({ id: "b", asOf: "2026-10-17" }), good({ id: "c", difficulty: "hard" })];

  const result = validateBank(bank, opts);

  assert.equal(result.valid, false);
  assert.equal(result.errors.length, 1);
  assert.match(result.errors[0], /asOf/);
});

test("flags a bank whose regular/hard counts don't match expectedRegular/expectedHard", () => {
  const bank = [
    good({ id: "a" }),
    good({ id: "b", difficulty: "hard" }),
    good({ id: "c", difficulty: "hard" }),
  ];

  const result = validateBank(bank, opts);

  assert.equal(result.valid, false);
  assert.equal(result.errors.length, 2);
  assert.match(result.errors[0], /regular/);
  assert.match(result.errors[1], /hard/);
});

test("passes a well-formed 30-regular + 20-hard bank with no errors", () => {
  const bank = [];
  for (let i = 0; i < 50; i++) {
    bank.push(
      good({
        id: `q${i}`,
        difficulty: i < 30 ? "regular" : "hard",
        source: `https://one.co.il/item/${i}`,
      }),
    );
  }

  const result = validateBank(bank);

  assert.deepEqual(result, { valid: true, errors: [] });
});

test("the real israeli-football.json content bank is valid (30 regular + 20 hard, internally consistent topic/id prefix)", () => {
  const bank = loadBank("israeli-football.json");

  const result = validateBank(bank, { expectedRegular: 30, expectedHard: 20 });

  assert.deepEqual(result.errors, []);
  assert.equal(result.valid, true);
  for (const q of bank) {
    assert.equal(q.topic, "israeli-football", `question "${q.id}" has topic "${q.topic}", expected "israeli-football"`);
    assert.match(q.id, /^isr-/, `question "${q.id}" does not start with the "isr-" prefix`);
  }
});

test("the real world-cup.json content bank is valid (30 regular + 20 hard, internally consistent topic/id prefix)", () => {
  const bank = loadBank("world-cup.json");

  const result = validateBank(bank, { expectedRegular: 30, expectedHard: 20 });

  assert.deepEqual(result.errors, []);
  assert.equal(result.valid, true);
  for (const q of bank) {
    assert.equal(q.topic, "world-cup", `question "${q.id}" has topic "${q.topic}", expected "world-cup"`);
    assert.match(q.id, /^wc-/, `question "${q.id}" does not start with the "wc-" prefix`);
  }
});
