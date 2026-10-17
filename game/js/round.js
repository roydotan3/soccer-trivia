// Assembles a 10-question round (7 regular + 3 hard) from a topic's question
// bank, preferring questions the player hasn't seen yet, and shuffling each
// question's answer options. Pure — no DOM, no storage.

export const REGULAR_COUNT = 7;
export const HARD_COUNT = 3;

// Fisher-Yates shuffle. Does not mutate the input array.
function shuffle(items, rng) {
  const result = items.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Picks `count` questions from a single difficulty bucket, preferring ids
// not in `seenIds`. Unseen questions are shuffled and placed first, seen
// questions are shuffled and placed after, then the front `count` are taken.
function pickBucket(questions, seenIds, count, rng) {
  const unseen = questions.filter((q) => !seenIds.has(q.id));
  const seen = questions.filter((q) => seenIds.has(q.id));
  const ordered = [...shuffle(unseen, rng), ...shuffle(seen, rng)];
  return ordered.slice(0, count);
}

// Converts a bank Question into a RoundQuestion, shuffling its options and
// recording where the original answer landed.
function toRoundQuestion(question, rng) {
  const options = shuffle([question.answer, ...question.distractors], rng);
  const correctIndex = options.indexOf(question.answer);
  return {
    id: question.id,
    question: question.question,
    detail: question.detail,
    difficulty: question.difficulty,
    options,
    correctIndex,
  };
}

export function buildRound(bank, seenIds = [], rng = Math.random) {
  const regular = bank.filter((q) => q.difficulty === "regular");
  const hard = bank.filter((q) => q.difficulty === "hard");

  if (regular.length < REGULAR_COUNT) {
    throw new Error(`bank has ${regular.length} regular questions, need at least ${REGULAR_COUNT}`);
  }
  if (hard.length < HARD_COUNT) {
    throw new Error(`bank has ${hard.length} hard questions, need at least ${HARD_COUNT}`);
  }

  const seen = new Set(seenIds);
  const picked = [
    ...pickBucket(regular, seen, REGULAR_COUNT, rng),
    ...pickBucket(hard, seen, HARD_COUNT, rng),
  ];

  const withOptions = picked.map((q) => toRoundQuestion(q, rng));
  return shuffle(withOptions, rng);
}
