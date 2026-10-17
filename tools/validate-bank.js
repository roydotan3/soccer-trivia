import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const REQUIRED_TEXT_FIELDS = ["id", "topic", "question", "answer", "detail", "source", "asOf"];
const DIFFICULTIES = ["regular", "hard"];
const URL_PATTERN = /^https?:\/\/\S+$/;
const AS_OF_PATTERN = /^\d{4}-\d{2}$/;

const isNonEmptyString = (value) => typeof value === "string" && value.trim() !== "";

export function validateBank(questions, opts = {}) {
  const expectedRegular = opts.expectedRegular ?? 30;
  const expectedHard = opts.expectedHard ?? 20;

  if (!Array.isArray(questions)) {
    return { valid: false, errors: ["bank must be an array of questions"] };
  }

  const errors = [];
  const seenIds = new Set();
  const counts = { regular: 0, hard: 0 };

  questions.forEach((q, i) => {
    if (typeof q !== "object" || q === null || Array.isArray(q)) {
      errors.push(`question #${i + 1}: not an object`);
      return;
    }

    const label = isNonEmptyString(q.id) ? `question "${q.id}"` : `question #${i + 1}`;

    for (const field of REQUIRED_TEXT_FIELDS) {
      if (!isNonEmptyString(q[field])) {
        errors.push(`${label}: missing or empty field "${field}"`);
      }
    }

    if (isNonEmptyString(q.id)) {
      if (seenIds.has(q.id)) {
        errors.push(`${label}: duplicate id "${q.id}"`);
      }
      seenIds.add(q.id);
    }

    if (DIFFICULTIES.includes(q.difficulty)) {
      counts[q.difficulty] += 1;
    } else {
      errors.push(`${label}: difficulty must be "regular" or "hard"`);
    }

    const distractors = q.distractors;
    if (!Array.isArray(distractors) || distractors.length !== 3 || !distractors.every(isNonEmptyString)) {
      errors.push(`${label}: distractors must be an array of exactly 3 non-empty strings`);
    } else if (isNonEmptyString(q.answer)) {
      const options = [q.answer, ...distractors].map((s) => s.trim());
      if (new Set(options).size !== options.length) {
        errors.push(`${label}: answer and distractors must all be distinct`);
      }
    }

    if (isNonEmptyString(q.source) && !URL_PATTERN.test(q.source)) {
      errors.push(`${label}: source must be a URL starting with http:// or https://`);
    }

    if (isNonEmptyString(q.asOf) && !AS_OF_PATTERN.test(q.asOf)) {
      errors.push(`${label}: asOf must be in YYYY-MM format`);
    }
  });

  if (counts.regular !== expectedRegular) {
    errors.push(`expected ${expectedRegular} regular questions, found ${counts.regular}`);
  }
  if (counts.hard !== expectedHard) {
    errors.push(`expected ${expectedHard} hard questions, found ${counts.hard}`);
  }

  return { valid: errors.length === 0, errors };
}

const isMain = process.argv[1] !== undefined && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  const path = process.argv[2];
  if (!path) {
    console.error("usage: node tools/validate-bank.js <path-to-json>");
    process.exit(2);
  }

  const questions = JSON.parse(readFileSync(path, "utf8"));
  const { valid, errors } = validateBank(questions);

  if (valid) {
    console.log("OK");
  } else {
    for (const error of errors) console.error(error);
    process.exit(1);
  }
}
