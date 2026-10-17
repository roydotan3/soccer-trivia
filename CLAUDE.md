# Soccer Trivia Game — project context for Claude Code

Free Hebrew web soccer-trivia game for kids aged 9–11. Owner: Roy (PM, not a programmer).

## Source of truth — read in this order
| File | Use it for |
|---|---|
| `docs/superpowers/specs/2026-10-17-batch-1-build-design.md` | **THE build design.** Approved architecture, UI direction (B — sticker album), content pipeline, screens, testing, deployment. Start here for how to build. |
| `product/soccer-trivia-game/08-prd.md` | **THE product spec** (local only — not in this public repo; see Repo scope in the design doc). Scope, MUST features with "done" criteria, content-accuracy protocol, metrics. |
| `product/soccer-trivia-game/06-mvp-scope.md` | Detail on MUST / LATER / WON'T and the end-to-end flow. Use when a scope question comes up. |
| `product/soccer-trivia-game/07-validation.md` | Why the stats panel exists (MUST #9). Don't cut it. |
| `product/soccer-trivia-game/02-users.md`, `03-use-cases.md` | Who it's for and why. Use when making UX or copy choices (age 9–11, Hebrew, parent-safe). |
| `product/soccer-trivia-game/01`, `04`, `05` | Background only. No need to read for building. |
| `product/soccer-trivia-game/00-status.md` | Flow status (discovery done 2026-10-15; build not started). |

Don't add features outside the PRD's MUST list. If something is ambiguous, ask Roy instead of deciding.

Note: `product/` is excluded from this (public) repo via `.gitignore`. It stays in Roy's local vault.

## Current task: Batch 1
- The full game (MUST 1–9)
- 100 questions: ⚽ כדורגל ישראלי (league + national team) and 🌍 נבחרות ומונדיאל, 50 each (30 regular + 20 hard)
- The other 3 topics are shown as "בקרוב" until batch 2

## Non-negotiable rules
- **Facts as of October 2026, verified by web search, never from model memory.** Every question has a source URL and an "as of" date. Run a separate verification pass (someone who didn't write the questions) that checks the answer AND that all 3 distractors are wrong. No manual spot-check deliverable needed — Roy will spot-check inside the live game if he wants to.
- No ads, no external analytics, no data leaving the device. localStorage only.
- Hebrew, RTL, mobile-first **and** desktop-friendly (centered "album" layout on wider screens).
- Hebrew name spellings (players/teams) follow ONE (one.co.il) as the single reference, so a name never appears spelled two ways.

## How to work with Roy
- Before coding, explain the architecture in plain terms: modules, data flow, hosting. Give alternatives and trade-offs for each choice, and flag workarounds and anything that isn't best practice.
- Link technical choices to product impact (cost, reliability, how kids get the link).
- Keep answers concise.
