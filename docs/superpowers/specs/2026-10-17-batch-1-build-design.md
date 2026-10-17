# Soccer Trivia Game — Batch 1 build design

Status: approved in chat with Roy, 2026-10-16/17. Source PRD: `product/soccer-trivia-game/08-prd.md` (local only, not in this public repo — see Repo scope below).

## Goal

Ship the full Batch 1 scope from the PRD: all 9 MUSTs, two live topics (⚽ כדורגל ישראלי, 🌍 נבחרות ומונדיאל) with 50 verified questions each, running on phone and desktop, deployed to GitHub Pages. Done means the PRD's end-to-end flow works on both phone and desktop.

## UI direction

**B — Sticker album.** Chosen from 3 mockups (A floodlights, B sticker album, C tactics board) presented on a Claude Design canvas. Rounds are rewarded as stickers in an album — ties the core reward loop to a collecting behavior kids aged 9–11 already know (Panini, FIFA packs), which directly serves the riskiest assumption (unprompted return play).

- Fonts: Secular One (display) + Assistant (body), Hebrew-supporting, loaded from Google Fonts.
- Palette: cream paper `#F3F0E8`, cobalt `#2340E0`, poster yellow `#FFC62E`, coral red `#FF5436`, ink `#15172A`.
- Signature motifs: thick ink borders, hard drop shadows (no blur), slight rotation on cards, torn-tape "הידעת?" note on wrong answers, a sticker card with a peeled corner on results.
- No animations beyond basic tap/press feedback (PRD puts sounds/animation in LATER).

## 1. Modules and data flow

```
game/
  index.html               one page; screens swap inside it
  css/styles.css            RTL, mobile-first, centered "album" column on desktop
  js/app.js                 conductor: which screen shows, wires clicks
  js/screens.js             renders the 4 screens: name · home · question · results
  js/round.js        [pure] builds a round: 7 regular + 3 hard, shuffled, unseen-first
  js/scoring.js      [pure] score -> stars, new-personal-best check
  js/storage.js              only module touching localStorage: name, bests, stats, seen-ids
  js/topics.js               the 5 topics: id, label, emoji, live|soon, data file path
  data/israeli-football.json   50 Qs
  data/world-cup.json          50 Qs
tests/
  round.test.js
  scoring.test.js
  storage.test.js
  bank.test.js               runs tools/validate-bank.js against both data files
tools/
  validate-bank.js           checks every question's fields, 30/20 split, 4 distinct options, source URL, asOf
content/
  research/<topic>-facts.md      step 1 output, cited facts
  verification/<topic>-report.md step 3 output, verdict per question
.github/workflows/deploy.yml     publishes game/ to GitHub Pages on push to main
```

`[pure]` modules take plain data in, return plain data out — no DOM, no storage — so they're unit-testable in Node without a browser.

**Flow:**
1. Open `index.html`. No saved name -> name screen. Otherwise home screen greets by name.
2. Home: album cover header, 2 live topic stickers (with stars + personal best, or "מדבקה חדשה מחכה"), 3 dashed "בקרוב" slots (not tappable), stats panel.
3. Tap a live topic -> fetch its JSON -> `round.js` builds 10 questions: for each difficulty bucket (7 regular, 3 hard), fill from that bucket's *unseen* question IDs first (shuffled), then top up from *seen* ones (shuffled) only if unseen supply in that bucket runs short. Once every question in a bucket has been seen, it's effectively a full shuffle of that bucket.
4. Each question: tap locks all 4 options, shows ✓/✗ state + the detail line, button becomes "לשאלה הבאה" (or "לתוצאות" on Q10).
5. After Q10: `scoring.js` computes stars; `storage.js` updates personal best, stats, and seen-IDs. A "day played" increments only here, on a completed round, using the local calendar date.
6. Results: score, stars, "שיא אישי חדש!" stamp when beaten, "עוד סיבוב" / "חזרה לאלבום".

**Error handling:**
- Question JSON fails to load -> Hebrew message: "לא הצלחנו לטעון שאלות — נסו לרענן".
- localStorage blocked (e.g. private window) -> game still plays, just doesn't persist; detected via a try/catch probe write.
- Corrupted saved data (bad JSON, wrong shape) -> reset that key to defaults silently, never crash.
- Exiting mid-round (✕ button) -> confirm prompt "לצאת? הסיבוב לא יישמר" before leaving; cancel returns to the question.

## 2. Question format and content pipeline

**Schema** (`data/<topic>.json`, array of):
```json
{
  "id": "wc-017",
  "topic": "world-cup",
  "difficulty": "hard",
  "question": "...",
  "answer": "...",
  "distractors": ["...", "...", "..."],
  "detail": "... (נכון לאוקטובר 2026)",
  "source": "https://...",
  "asOf": "2026-10"
}
```
30 `"regular"` + 20 `"hard"` per topic file, 50 total per topic.

**Pipeline** (run once per topic, repeated for Batch 2 topics later):

1. **Research** — an agent web-searches current facts (2025/26 league + cup winners, Israel national team results, full 2026 World Cup: winner, final, top scorer, hosts, surprises, plus stable classics). Output: `content/research/<topic>-facts.md`, one fact per line with its source URL. Never from model memory — knowledge cutoff predates these facts.
2. **Write** — a second step writes 50 questions using *only* that fact sheet. 30 regular (club cities, famous players, champions) + 20 hard (years, numbers, records). Output: `data/<topic>.json`.
3. **Verify (independent)** — a separate pass that sees only the finished questions, not the research notes or writer's reasoning. It re-searches each one and checks: (a) the answer is correct, (b) all 3 distractors are definitely wrong, (c) the wording isn't ambiguous (the "Anfield — Everton played there first" trap: say "today" when a fact changed), (d) it reads naturally for a 9–11-year-old Hebrew reader. Output: `content/verification/<topic>-report.md`, one verdict (pass/fix/drop) + evidence URL per question.
4. **Fix loop** — fix or replace flagged questions, re-verify only those, until every question passes.
5. **Automated validator** (`tools/validate-bank.js`, run as a test) — every field present, 30/20 split exact, 4 distinct non-empty options, `source` is a URL, `asOf` is `YYYY-MM`, no duplicate `id`.

No manual spot-check deliverable — Roy will spot-check inside the live game if needed.

**Content rules:**
- 🌍 topic: at least 20 of its 50 questions are about the 2026 World Cup specifically (it just ended — freshest in kids' minds).
- All player/team Hebrew name spellings follow **ONE (one.co.il)** as the single reference, checked in verification step 3, so the same name never appears spelled two ways across the bank.

## 3. Screens and UX (direction B)

1. **Name (first visit only).** Album-cover framing: "של מי האלבום הזה?", name input (1–20 chars, required), "פתח את האלבום" button. Trust line under it: "בלי פרסומות · בלי הרשמה · שום מידע לא יוצא מהמכשיר" (answers the PRD's open question on parent trust).
2. **Home.** As designed on canvas (`B-Home.dc.html`): greeting, 2 live topic stickers with star/best or "מדבקה חדשה מחכה", 3 dashed "בקרוב" slots, stats panel (rounds, correct answers, days played).
3. **Question.** Tap locks all 4 options. Correct option turns cobalt with a check; if wrong, the player's pick gets struck through with a "הבחירה שלך" tag and the correct one turns cobalt. A taped note shows "נכון!" or "לא הפעם! התשובה: X" plus the detail line. Button: "לשאלה הבאה" (Q1–9) / "לתוצאות" (Q10). ✕ in the header asks to confirm before exiting (see error handling above).
4. **Results.** Score `X/10` on a sticker card with 0–3/4–6/7–8/9–10 star thresholds (0–3 = "כמעט! נסה שוב", no stars). "שיא אישי חדש!" stamp whenever this round's score is strictly greater than the stored best for that topic — "no best yet" is treated as below 0, so the very first completed round on a topic always sets a best and shows the stamp, even at 0/10. Buttons: "עוד סיבוב" (reshuffle same topic) / "חזרה לאלבום".

**Unseen-questions-first (approved, beyond MUST list but low-cost):** `round.js` tracks which question IDs the player has seen per topic (via `storage.js`) and draws unseen ones first per difficulty bucket, as detailed in §1 above. Directly addresses PRD risk #3 ("I've seen this already") for ~15 lines of code.

**Responsive:** phone fills full width. Desktop/tablet: centered "album" column ~440px wide on the cobalt halftone background, with a book-spine edge, so it reads as an album open on a table rather than a stretched phone.

**Accessibility / basics:** real `<button>`/`<input>` elements (keyboard operable); text contrast checked at 4.5:1; scores like `7/10` kept LTR inside RTL text via `dir="ltr"` spans; no emoji icons — all icons are inline stroke SVG.

## 4. Testing and deployment

| What | How | Catches |
|---|---|---|
| `round.js` | `node --test` | Always 10 Qs, exactly 7 regular + 3 hard, no repeats, answer always among the 4 options, unseen-first, fallback once a topic is exhausted |
| `scoring.js` | `node --test` | Star boundaries at 3/4, 6/7, 8/9; new-best logic incl. first round and score 0 |
| `storage.js` | `node --test` with a fake localStorage | Name persists; 2 rounds same day = 1 day played; unfinished round = 0 days; corrupted data resets quietly; blocked storage doesn't throw |
| Question bank | `tools/validate-bank.js` run as a test | Missing field, wrong 30/20 split, duplicate options, missing source URL |
| Real flow | Local static server + browser check at 375px and desktop width | Full PRD end-to-end flow, checked against the canvas mockups |

**Deployment:**
- Game lives in `game/` at repo root. `.github/workflows/deploy.yml` publishes only `game/` to GitHub Pages on every push to `main`.
- URL: `https://<username>.github.io/soccer-trivia/` (final repo name TBD at creation time).
- Batch 2 / fact fixes: edit or add a JSON file, push, live in ~1–2 minutes. Each data file fetch includes a version query param so phones don't serve a stale cached copy.
- Creating the GitHub repo and pushing requires Roy's explicit go-ahead (publishing action).

## Repo scope

Public repo. **Game only** — `game/`, `tests/`, `tools/`, `content/`, `.github/`, this spec, and the project's own `CLAUDE.md`. The `product/` folder (PRD and discovery docs) stays local in Roy's vault and is excluded via `.gitignore` — it is not published, since the repo is public.

## Out of scope (confirmed via PRD, unchanged)

Everything in PRD's LATER/WON'T: guess-the-player question type, progress map, timer/streaks/combos, shareable score, sounds/animations, admin sync role, accounts/login, multiplayer, kid-contributed content, player-chosen difficulty, ads/analytics/payments, non-Hebrew, native app, live scores/news.
