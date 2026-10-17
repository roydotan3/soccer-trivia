// Pure scoring helpers. No DOM, no storage.

// Maps a 0-10 round score to 0-3 stars.
export function starsForScore(score) {
  if (score >= 9) return 3;
  if (score >= 7) return 2;
  if (score >= 4) return 1;
  return 0;
}

// True when the score beats the previous best. A null previousBest means
// "no best yet", so any score (including 0) counts as a new best.
export function isNewBest(score, previousBest) {
  if (previousBest === null) return true;
  return score > previousBest;
}
