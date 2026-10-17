# Soccer Trivia Game — Batch 1 Build Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the full Batch 1 soccer trivia game — 9 MUST features, 2 live topics with 50 verified questions each, sticker-album UI (direction B), tested, and deployed to GitHub Pages.

**Architecture:** Plain HTML/CSS/ES-module JS under `game/`, no build step, no runtime dependencies. Pure logic (`scoring.js`, `round.js`) is unit-tested with Node's built-in test runner; `storage.js` takes an injectable storage object so localStorage behavior is also unit-testable; the DOM shell (`screens.js` + `app.js`) is verified by a scripted browser walkthrough against the approved canvas mockups. Question content is produced by a research → write → **independently verified** → fix-loop pipeline per topic, gated by an automated schema validator.

**Tech Stack:** Vanilla JS (ES modules, `type: "module"` in `package.json`), Node.js ≥20 (`node --test`) for the test suite and content tooling, no bundler, no npm dependencies. Google Fonts (Secular One, Assistant) loaded via `<link>`. GitHub Actions + GitHub Pages for deployment.

**Spec:** `docs/superpowers/specs/2026-10-17-batch-1-build-design.md` — read it alongside this plan; this plan does not repeat its rationale, only the decisions an implementer needs.

## Global Constraints

- No runtime dependencies beyond Google Fonts; no bundler, no transpiler — the game must run by serving `game/` as static files.
- ES modules throughout (`<script type="module">` in the browser, `"type": "module"` in `package.json` for Node).
- `game/index.html` must be served over HTTP(S) (not opened via `file://`) because it `fetch()`es the JSON data files — all local verification uses a static file server.
- Hebrew, RTL: `lang="he" dir="rtl"` on `<html>`, mobile-first, and desktop-friendly via a centered ~440px "album" column (no stretched-phone look).
- No ads, no external analytics, no network calls other than fetching the game's own JSON files and Google Fonts. No data leaves the device.
- No animations beyond basic tap/press feedback (per spec — LATER scope only).
- Every question has a `source` URL and an `asOf` (`YYYY-MM`) date; facts are never taken from model memory, only from web search done at build time.
- The question-bank verification pass (Task 5 & 6, Step on independent review) MUST be performed by a fresh subagent that is given only the finished question file — never the research notes or the writer's reasoning — regardless of which execution method (native or subagent-driven) is used for the rest of this plan.
- Hebrew player/team name spellings follow **ONE (one.co.il)** as the single reference across both topics.
- Each topic file has exactly 30 `"regular"` + 20 `"hard"` questions (50 total). The 🌍 topic has at least 20 of its 50 questions specifically about the 2026 World Cup.
- Exact Hebrew copy strings are pinned in Task 7's copy table — transcribe them exactly, do not paraphrase.
- Repo is public. `product/` (PRD, discovery docs) stays out of git via `.gitignore` — already done. Only `game/`, `tests/`, `tools/`, `content/`, `.github/`, this plan/spec, and `CLAUDE.md` are tracked.
- Creating the GitHub repo and pushing (Task 8) is a publishing action — it requires Roy's explicit go-ahead before it happens, even if every other task is approved.

## Review Focus

1. **Round assembly integrity** — every question `buildRound` returns must have exactly 4 distinct option strings and a `correctIndex` that truly points at the right answer; a shuffle bug here would show two identical options or mark the wrong one correct. *(Pinned: Task 3, Step on option-integrity test.)*
2. **"Day played" counts by local calendar date, not by round count** — two completed rounds on the same date must count as 1 day played; an unfinished round must count as 0. Getting this wrong silently breaks the PRD's north-star metric. *(Pinned: Task 4, Step on day-counting tests.)*
3. **Question data fails to load** (renamed/missing/malformed JSON file) must show the Hebrew fallback message, not a blank or broken screen. *(Pinned: Task 7, walkthrough step on load failure.)*
4. **Exiting mid-round**: Cancel must resume the exact same question unchanged; Confirm must return to the album home screen and must NOT record any stats (no rounds/correct/day increment, no best update) for that abandoned round. *(Pinned: Task 7, walkthrough step on exit-confirm.)*
5. **Keyboard operability**: every answer button, the exit button, and the next/results button must be real, focusable elements reachable by Tab in a sane order and activatable with Enter/Space — the spec requires this explicitly for the parent/desktop use case. *(Pinned: Task 7, walkthrough step on keyboard navigation.)*

---

### Task 1: Project scaffold & question-bank validator

**Files:**
- Create: `package.json`
- Create: `tools/validate-bank.js`
- Test: `tests/bank.test.js`

**Interfaces:**
- Produces: `validateBank(questions: Question[], opts?: { expectedRegular?: number, expectedHard?: number }): { valid: boolean, errors: string[] }`, exported from `tools/validate-bank.js`. Defaults: `expectedRegular: 30, expectedHard: 20`. Also runnable as a CLI: `node tools/validate-bank.js <path-to-json>` — prints each error (if any) and exits 1 on failure, prints `OK` and exits 0 on success.
- `Question` shape (used by every later task): `{ id: string, topic: string, difficulty: "regular"|"hard", question: string, answer: string, distractors: string[3], detail: string, source: string, asOf: string }`.

- [ ] **Step 1: Write `package.json`**

`{ "name": "soccer-trivia-game", "private": true, "type": "module", "scripts": { "test": "node --test" } }`

- [ ] **Step 2: Write the failing tests in `tests/bank.test.js`**

Use small inline arrays of 2–3 questions per case (not a shared fixture file). Cases:
```js
test("flags a question missing a required field");
test("flags a duplicate id across the bank");
test("flags distractors that duplicate each other or the answer");
test("flags a source that is not a URL");
test("flags an asOf that is not YYYY-MM");
test("flags a bank whose regular/hard counts don't match expectedRegular/expectedHard");
test("passes a well-formed 30-regular + 20-hard bank with no errors");
```
Each asserts on the shape `{ valid, errors }` returned by `validateBank`.

- [ ] **Step 3: Run tests to verify they fail**

Run: `node --test tests/bank.test.js`
Expected: FAIL — `validateBank is not a function` / module not found.

- [ ] **Step 4: Implement `validateBank` and the CLI in `tools/validate-bank.js`**

Validate each question against the `Question` shape above (every field present and non-empty, `difficulty` is exactly `"regular"` or `"hard"`, `distractors.length === 3` and all 4 of `[answer, ...distractors]` are pairwise distinct, `source` starts with `"http"`, `asOf` matches `/^\d{4}-\d{2}$/`), check `id` uniqueness across the whole array, and check the regular/hard counts against `opts`. Collect every violation into `errors` (don't stop at the first). CLI block reads the JSON file at `process.argv[2]`, calls `validateBank`, prints result.

- [ ] **Step 5: Run tests to verify they pass**

Run: `node --test tests/bank.test.js`
Expected: PASS, all cases green.

- [ ] **Step 6: Commit**

```bash
git add package.json tools/validate-bank.js tests/bank.test.js
git commit -m "Add project scaffold and question-bank validator"
```

---

### Task 2: Scoring module

**Files:**
- Create: `game/js/scoring.js`
- Test: `tests/scoring.test.js`

**Interfaces:**
- Produces: `starsForScore(score: number): 0|1|2|3` and `isNewBest(score: number, previousBest: number|null): boolean`, both exported from `game/js/scoring.js`. `previousBest === null` means "no best yet" and is treated as below 0 (so the first completed round always counts as a new best).

- [ ] **Step 1: Write the failing tests in `tests/scoring.test.js`**

```js
test("starsForScore: 0-3 -> 0");       // scores 0, 1, 3
test("starsForScore: 4-6 -> 1");       // scores 4, 6
test("starsForScore: 7-8 -> 2");       // scores 7, 8
test("starsForScore: 9-10 -> 3");      // scores 9, 10
test("isNewBest: null previousBest is always beaten, including score 0");
test("isNewBest: true only when score is strictly greater than previousBest");
test("isNewBest: false when score equals or is less than previousBest");
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test tests/scoring.test.js`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `starsForScore` and `isNewBest` in `game/js/scoring.js`**

Straightforward threshold/comparison logic; no algorithm beyond what the tests pin.

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test tests/scoring.test.js`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add game/js/scoring.js tests/scoring.test.js
git commit -m "Add scoring module (stars, new-best check)"
```

---

### Task 3: Round builder module

**Files:**
- Create: `game/js/round.js`
- Create: `tests/fixtures/sample-bank.json` (synthetic, not real content — ~12 regular + ~6 hard questions, all fields filled with placeholder text, enough margin over the 7/3 needed per round)
- Test: `tests/round.test.js`

**Interfaces:**
- Consumes: the `Question` shape from Task 1.
- Produces: `REGULAR_COUNT = 7`, `HARD_COUNT = 3` (exported constants) and `buildRound(bank: Question[], seenIds?: string[], rng?: () => number): RoundQuestion[]`, exported from `game/js/round.js`.
  `RoundQuestion = { id: string, question: string, detail: string, difficulty: "regular"|"hard", options: string[4], correctIndex: number }` — `options` is `[answer, ...distractors]` shuffled; `correctIndex` is where the answer landed. `rng` defaults to `Math.random` and is injectable for deterministic tests. Throws if `bank` has fewer than 7 regular or fewer than 3 hard questions total.

- [ ] **Step 1: Create `tests/fixtures/sample-bank.json`**

A JSON array of synthetic questions (not from the real game content) satisfying the `Question` shape, with ≥12 `"regular"` and ≥6 `"hard"` entries, distinct `id`s.

- [ ] **Step 2: Write the failing tests in `tests/round.test.js`**

```js
test("returns exactly 10 questions: 7 regular + 3 hard");
test("every returned question's id exists in the input bank, no duplicate ids in the result");
test("every returned question has exactly 4 distinct option strings");          // Review Focus #1
test("options[correctIndex] equals the bank question's original answer for every returned question"); // Review Focus #1
test("prefers unseen ids: given seenIds covering all but one regular id, that one unseen id is always chosen over seen ones"); // use a fixed rng like () => 0
test("falls back to seen ids once a bucket's unseen supply runs out: with all ids marked seen, still returns a full 7+3 without throwing");
test("throws when the bank has fewer than 7 regular or fewer than 3 hard questions");
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `node --test tests/round.test.js`
Expected: FAIL — module not found.

- [ ] **Step 4: Implement `buildRound` in `game/js/round.js`**

Split `bank` by `difficulty`. For each bucket, partition ids into unseen (not in `seenIds`) and seen, shuffle each partition with `rng` (Fisher–Yates), concatenate unseen-then-seen, and take the bucket's required count (`REGULAR_COUNT` or `HARD_COUNT`) from the front. For each selected question, shuffle `[answer, ...distractors]` with `rng` and record the index of the original answer as `correctIndex`. Shuffle the combined 10-question result's order with `rng` before returning.

- [ ] **Step 5: Run tests to verify they pass**

Run: `node --test tests/round.test.js`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add game/js/round.js tests/fixtures/sample-bank.json tests/round.test.js
git commit -m "Add round builder module with unseen-first selection"
```

---

### Task 4: Local storage module

**Files:**
- Create: `game/js/storage.js`
- Test: `tests/storage.test.js`

**Interfaces:**
- Consumes: `isNewBest` from Task 2 (`game/js/scoring.js`).
- Produces: `createStore(storageImpl?: StorageLike): Store` and `todayLocalDateStr(d?: Date): string` ("YYYY-MM-DD", local time), both exported from `game/js/storage.js`.
  `StorageLike` = an object with `getItem(key)`, `setItem(key, value)`, `removeItem(key)` (the same shape as `window.localStorage`); defaults to `globalThis.localStorage`.
  `Store = { getName(): string|null, setName(name: string): void, getBest(topicId: string): number|null, getStats(): { rounds: number, correct: number, days: number }, getSeenIds(topicId: string): string[], recordCompletedRound(topicId: string, args: { score: number, correctCount: number, allQuestionIds: string[], dateStr?: string }): { isNewBest: boolean, best: number } }`.
  All reads/writes are wrapped in try/catch: a throwing `storageImpl` must never propagate — reads fall back to defaults, writes are silently dropped. Malformed JSON read back from a key resets that key to its default (does not throw).

- [ ] **Step 1: Write the failing tests in `tests/storage.test.js`**

Build a tiny in-memory fake implementing `getItem`/`setItem`/`removeItem` (a `Map`-backed object) for normal cases, a variant whose methods always `throw`, and a variant that returns a non-JSON garbage string for a given key.

```js
test("getName/setName round-trip through the storage object");
test("getName returns null when nothing is stored");
test("getBest returns null for a topic with no recorded rounds");
test("recordCompletedRound sets isNewBest true and updates getBest on the first round for a topic, even with score 0"); // Review Focus (new-best @ 0)
test("recordCompletedRound: a later lower or equal score does not change getBest and reports isNewBest false");
test("recordCompletedRound twice with the same dateStr: getStats().days is 1");       // Review Focus #2
test("recordCompletedRound with two different dateStr values: getStats().days is 2"); // Review Focus #2
test("getStats().rounds and .correct accumulate across multiple recordCompletedRound calls");
test("getSeenIds reflects allQuestionIds merged in by prior recordCompletedRound calls for that topic, deduplicated");
test("a throwing storageImpl: every Store method returns its default and never throws");
test("a storageImpl returning garbage JSON for a key: the affected read falls back to its default instead of throwing");
test("todayLocalDateStr formats a given Date as YYYY-MM-DD in local time");
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test tests/storage.test.js`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `createStore` and `todayLocalDateStr` in `game/js/storage.js`**

Namespace all keys under a `soccer-trivia:v1:` prefix (e.g. `:name`, `:bests`, `:stats`, `:seen:<topicId>`, `:played-dates`), storing JSON-serialized values. `getStats().days` is the size of the set of distinct `dateStr` values ever passed to `recordCompletedRound`. Use `isNewBest` (Task 2) inside `recordCompletedRound` to decide whether to update the stored best and what to return.

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test tests/storage.test.js`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add game/js/storage.js tests/storage.test.js
git commit -m "Add storage module: name, bests, stats, seen-ids, day counting"
```

---

### Task 5: Content — ⚽ כדורגל ישראלי (50 questions)

**Files:**
- Create: `content/research/israeli-football-facts.md`
- Create: `game/data/israeli-football.json`
- Create: `content/verification/israeli-football-report.md`

**Interfaces:**
- Produces: `game/data/israeli-football.json` — a `Question[]` per Task 1's schema, `topic: "israeli-football"`, exactly 30 `"regular"` + 20 `"hard"`, every `id` prefixed `isr-`. Consumed by Task 7.

- [ ] **Step 1: Research** — web-search current facts covering the 2025/26 Israeli league + cup winners, the Israel national team's recent results, Israeli football history (champions, records, famous players, stadiums, cities), plus stable classics. Write one fact per line to `content/research/israeli-football-facts.md`, each line ending with its source URL. Target ≥60 facts (more than 50 questions need, so the writer has slack to pick the best ones). Never from memory — search for anything dated 2025 or later.

- [ ] **Step 2: Write 50 questions into `game/data/israeli-football.json`**

Using *only* `israeli-football-facts.md` (no outside knowledge), write 30 `"regular"` (club identity, cities, famous players, well-known champions) and 20 `"hard"` (exact years, counts, records) questions matching the `Question` schema. Hebrew player/team names follow ONE (one.co.il) spelling. Every `source`/`asOf` copied from the matching research fact.

- [ ] **Step 3: Run the schema validator**

Run: `node tools/validate-bank.js game/data/israeli-football.json`
Expected: `OK` (exit 0). Fix and re-run until it is.

- [ ] **Step 4: Independent verification (mandatory fresh subagent)**

Dispatch a fresh subagent (one that has NOT seen `israeli-football-facts.md` or the writing step's reasoning — give it only the contents of `game/data/israeli-football.json`) with instructions to, for every question: (a) re-search and confirm the answer is correct, (b) confirm all 3 distractors are definitely wrong, (c) flag any ambiguous wording (the "a fact that changed" trap — e.g. a once-true-always-changing record), (d) confirm the phrasing reads naturally for a 9–11-year-old Hebrew reader. It writes one verdict (`pass` / `fix` / `drop`) + evidence URL per question `id` to `content/verification/israeli-football-report.md`.

- [ ] **Step 5: Fix loop**

For every `fix`/`drop` verdict, correct or replace that question in `game/data/israeli-football.json` (replacements keep the file's 30/20 split and get a new unused `isr-` id). Re-run Step 4's subagent dispatch, scoped only to the changed questions, and append its verdicts to the report.

- [ ] **Step 6: Final check**

Run: `node tools/validate-bank.js game/data/israeli-football.json` → `OK`. Confirm `content/verification/israeli-football-report.md` has a `pass` verdict for every question `id` currently in the file.

- [ ] **Step 7: Commit**

```bash
git add content/research/israeli-football-facts.md game/data/israeli-football.json content/verification/israeli-football-report.md
git commit -m "Add verified Israeli football question bank (50 Qs)"
```

---

### Task 6: Content — 🌍 נבחרות ומונדיאל (50 questions)

**Files:**
- Create: `content/research/world-cup-facts.md`
- Create: `game/data/world-cup.json`
- Create: `content/verification/world-cup-report.md`

**Interfaces:**
- Produces: `game/data/world-cup.json` — a `Question[]` per Task 1's schema, `topic: "world-cup"`, exactly 30 `"regular"` + 20 `"hard"`, every `id` prefixed `wc-`. At least 20 of the 50 are specifically about the 2026 World Cup. Consumed by Task 7.

- [ ] **Step 1: Research** — web-search the full 2026 World Cup (winner, final score, top scorer, host cities, notable upsets/surprises), national-team World Cup history (multi-time champions, famous finals, records), and stable classics. Write to `content/research/world-cup-facts.md` as in Task 5, Step 1, with at least 25 facts specifically about the 2026 tournament.

- [ ] **Step 2: Write 50 questions into `game/data/world-cup.json`**

Same process as Task 5 Step 2. At least 20 of the 50 questions must be specifically about the 2026 World Cup (not older tournaments). 30 `"regular"` / 20 `"hard"` split.

- [ ] **Step 3: Run the schema validator**

Run: `node tools/validate-bank.js game/data/world-cup.json`
Expected: `OK`. Fix and re-run until it is.

- [ ] **Step 4: Independent verification (mandatory fresh subagent)**

Same process as Task 5 Step 4, applied to `game/data/world-cup.json`, writing `content/verification/world-cup-report.md`.

- [ ] **Step 5: Fix loop** — same process as Task 5 Step 5.

- [ ] **Step 6: Final check**

Run: `node tools/validate-bank.js game/data/world-cup.json` → `OK`. Confirm every question `id` has a `pass` verdict in the report. Confirm (by counting) at least 20 questions are 2026-World-Cup-specific.

- [ ] **Step 7: Commit**

```bash
git add content/research/world-cup-facts.md game/data/world-cup.json content/verification/world-cup-report.md
git commit -m "Add verified World Cup / national teams question bank (50 Qs)"
```

---

### Task 7: Game shell — HTML, CSS, topics, screens, app wiring

**Files:**
- Create: `game/index.html`
- Create: `game/css/styles.css`
- Create: `game/js/topics.js`
- Create: `game/js/screens.js`
- Create: `game/js/app.js`
- Create: `tools/serve.js` (zero-dependency static file server for local verification; not part of the deployed `game/` folder)
- Test: `tests/topics.test.js`

**Interfaces:**
- Consumes: `buildRound`, `REGULAR_COUNT`, `HARD_COUNT` (Task 3); `starsForScore`, `isNewBest` (Task 2, via `storage.js`); `createStore`, `todayLocalDateStr` (Task 4); `game/data/israeli-football.json`, `game/data/world-cup.json` (Tasks 5–6).
- Produces: a working `game/index.html` entry point. No other task consumes this task's internal functions.

**Pinned Hebrew copy** (transcribe exactly):

| Screen | Element | Hebrew text |
|---|---|---|
| Name | Title | `של מי האלבום הזה?` |
| Name | Button | `פתח את האלבום` |
| Name | Trust line | `בלי פרסומות · בלי הרשמה · שום מידע לא יוצא מהמכשיר` |
| Home | Greeting | `שלום {name}!` |
| Home | Unplayed topic | `מדבקה חדשה מחכה` |
| Home | Topic best | `שיא {best}/10` |
| Home | Coming-soon slot | `בקרוב` |
| Home | Stats labels | `סיבובים`, `תשובות נכונות`, `ימי משחק` |
| Question | Correct tag | `נכון!` |
| Question | Wrong tag | `לא הפעם! התשובה: {answer}` |
| Question | "Your pick" tag | `הבחירה שלך` |
| Question | Next button (Q1–9) | `לשאלה הבאה` |
| Question | Next button (Q10) | `לתוצאות` |
| Question | Exit-confirm prompt | `לצאת? הסיבוב לא יישמר` |
| Question | Exit-confirm, leave | `לצאת` |
| Question | Exit-confirm, cancel | `להמשיך` |
| Question | Load-failure message | `לא הצלחנו לטעון שאלות — נסו לרענן` |
| Results | Miss banner (0–3) | `כמעט! נסה שוב` |
| Results | New-best stamp | `שיא אישי חדש!` |
| Results | Buttons | `עוד סיבוב`, `חזרה לאלבום` |

**Pinned visual tokens** (direction B): background `#F3F0E8`, cobalt `#2340E0`, poster yellow `#FFC62E`, coral `#FF5436`, ink `#15172A`; display font `Secular One`, body font `Assistant` (Google Fonts); thick ink borders, hard (non-blurred) drop shadows, slight card rotation, no emoji icons (inline stroke SVG only).

- [ ] **Step 1: Write `tests/topics.test.js`**

```js
test("TOPICS has exactly 5 entries");
test("exactly 2 entries have status 'live' and a dataFile path");
test("the 2 live entries' ids are 'israeli-football' and 'world-cup'");
test("the 3 non-live entries have status 'soon'");
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/topics.test.js`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `game/js/topics.js`**

Export `TOPICS`, an array of 5 `{ id, emoji, label, sublabel?, status: "live"|"soon", dataFile? }` objects: `israeli-football` (⚽, `כדורגל ישראלי`, `ליגת העל + הנבחרת`, live, `data/israeli-football.json`), `world-cup` (🌍, `נבחרות ומונדיאל`, `כולל מונדיאל 2026`, live, `data/world-cup.json`), and 3 `soon` entries — `הפרמייר ליג`, `לה ליגה`, `ליגת האלופות`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/topics.test.js`
Expected: PASS.

- [ ] **Step 5: Implement `game/css/styles.css` and `game/index.html`**

`index.html`: `<html lang="he" dir="rtl">`, loads the two Google Fonts, `<link rel="stylesheet" href="css/styles.css">`, a single root container (e.g. `<div id="app">`), `<script type="module" src="js/app.js"></script>`. `styles.css`: body background `#2340E0` (cobalt) outside the app so the "album on a table" effect shows on wide viewports; `#app { width: 100%; max-width: 440px; margin: 0 auto; min-height: 100vh; background: #F3F0E8; position: relative; box-shadow: 0 0 40px rgba(0,0,0,0.25); }` — this single max-width rule handles both the full-width phone layout and the centered desktop column without a media query. Implement the card/button/sticker styling matching the canvas mockups (`B-Home.dc.html`, `B-Question.dc.html`, `B-Results.dc.html` on the design canvas) using the pinned visual tokens above. All interactive elements are real `<button>`/`<input>`.

- [ ] **Step 6: Implement `game/js/screens.js`**

Export one render function per screen, each taking `(container: HTMLElement, viewModel, callbacks)` and replacing `container`'s content: `renderNameScreen(container, {}, { onSubmit(name) })`, `renderHomeScreen(container, { name, topics: (topic & {best, playable})[], stats }, { onPickTopic(topicId) })`, `renderQuestionScreen(container, { index, total, difficulty, question, options, selectedIndex, correctIndex, detail, isAnswered }, { onSelect(i), onNext(), onExit() })`, `renderResultsScreen(container, { topicLabel, score, stars, isNewBest, previousBest }, { onPlayAgain(), onChooseTopic() })`. Use the pinned copy table and visual tokens verbatim. The exit-confirm prompt is rendered as a small inline panel/modal inside the question screen (triggered by `onExit`), with its own leave/cancel buttons — it does not call back to `app.js` until the kid picks one.

- [ ] **Step 7: Implement `game/js/app.js`**

A small state machine: `name screen -> home -> question (x10) -> results -> (home | question)`. On startup, `createStore()` (Task 4) and `store.getName()` decide the first screen. Home screen reads `TOPICS` (Task 7 Step 3), each live topic's `store.getBest(topic.id)`, and `store.getStats()`. Picking a live topic `fetch(topic.dataFile)`s its JSON (append a version query param, e.g. `?v=1`, to avoid stale phone caches); on fetch/parse failure, render the load-failure message (pinned copy) instead of advancing. On success, call `buildRound(bank, store.getSeenIds(topic.id))` (Task 3) and enter the question loop. Each answered question accumulates a `correctCount` and the full list of shown question ids. On the 10th question's "לתוצאות", call `store.recordCompletedRound(topic.id, { score: correctCount, correctCount, allQuestionIds })` (Task 4) and render results with `starsForScore(score)` (Task 2) and the `{ isNewBest, best }` the store call returned. The exit-confirm's "leave" callback returns straight to the home screen WITHOUT calling `recordCompletedRound`.

- [ ] **Step 8: Write `tools/serve.js`**

A zero-dependency static file server (Node's built-in `http` + `fs`/`path` modules only) serving a given root directory on a given port, defaulting to `game/` and port `8080`. Usage: `node tools/serve.js [root] [port]`.

- [ ] **Step 9: Scripted browser walkthrough**

Run: `node tools/serve.js` and open `http://localhost:8080/` in the built-in browser. Resize to 375px width (phone) and confirm, then repeat at a desktop width (≥1024px):

- First visit shows the name screen; entering a name and submitting shows `שלום <name>!` on the home screen; refreshing the page keeps the same name (persistence).
- Home screen shows both live topics with correct emoji/labels and `מדבקה חדשה מחכה` (no best yet), and 3 non-tappable `בקרוב` slots; stats panel shows `0` for all three counters before any round.
- Picking a live topic starts a round of 10 questions, visibly mixing regular and hard (per the difficulty indicator).
- Answering shows ✓/✗ state, the correct option highlighted, a wrong pick struck through and tagged `הבחירה שלך`, and the detail line — matching the `B-Question.dc.html` canvas mockup.
- Question 10's button reads `לתוצאות`; all others read `לשאלה הבאה`.
- Results screen shows the score, correct star count, and `שיא אישי חדש!` on the very first completed round for that topic (even if the score is low) — matching `B-Results.dc.html`.
- `עוד סיבוב` starts a fresh shuffled round in the same topic; `חזרה לאלבום` returns home with updated best/stats.
- **Review Focus #3 — load failure:** temporarily rename `game/data/world-cup.json`, reload, pick that topic, confirm the Hebrew load-failure message appears (no blank screen, no uncaught console error), then restore the file.
- **Review Focus #4 — exit confirm:** mid-round, tap the exit (✕) button; confirm the `לצאת? הסיבוב לא יישמר` prompt appears; tap `להמשיך` and confirm the same question/state is still showing; tap exit again, tap `לצאת`, and confirm you're on the home screen with stats/best unchanged from before that round started.
- **Review Focus #5 — keyboard:** using only Tab and Enter/Space, reach and activate each of the 4 answer buttons, the next/results button, and the exit button, in a sane (non-trapped) order.
- Confirm the desktop view shows the centered ~440px album column on the cobalt background, not a stretched phone layout.

Fix any discrepancy against the canvas mockups or this checklist before proceeding.

- [ ] **Step 10: Commit**

```bash
git add game/index.html game/css/styles.css game/js/topics.js game/js/screens.js game/js/app.js tools/serve.js tests/topics.test.js
git commit -m "Add game shell: screens, app wiring, and sticker-album styling"
```

---

### Task 8: Deploy to GitHub Pages

**Files:**
- Create: `.github/workflows/deploy.yml`

**Interfaces:**
- Consumes: the `game/` folder as a whole (Tasks 5–7).
- Produces: a public GitHub Pages URL serving `game/`'s contents at its root.

- [ ] **Step 1: Write `.github/workflows/deploy.yml`**

A workflow triggered `on: push: branches: [main]` that uploads only the `game/` directory as the Pages artifact (`actions/upload-pages-artifact` with `path: game`) and deploys it (`actions/configure-pages` + `actions/deploy-pages`), using the standard `pages: write` / `id-token: write` permissions.

- [ ] **Step 2: Local sanity check**

Run: `node tools/serve.js` and confirm `game/` still serves correctly end-to-end (reuses Task 7 Step 9's walkthrough at a glance — not a full repeat, just confirm nothing in Task 8 Step 1 touched `game/`).

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Pages deploy workflow"
```

- [ ] **Step 4: Ask Roy before publishing**

Stop here. Creating the GitHub repository, pushing this branch, and enabling Pages are publishing actions — confirm with Roy (repo name, public visibility already agreed as "game only") before running them. Once confirmed: create the repo, push `main`, enable Pages (Settings → Pages → Source: GitHub Actions), wait for the workflow run to succeed, then open the resulting `https://<username>.github.io/<repo>/` URL in the built-in browser and re-run Task 7 Step 9's walkthrough checklist against the live URL.

---
