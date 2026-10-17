import { test } from "node:test";
import assert from "node:assert/strict";
import { TOPICS } from "../game/js/topics.js";

test("TOPICS has exactly 5 entries", () => {
  assert.equal(TOPICS.length, 5);
});

test("all 5 entries are live and have a dataFile path", () => {
  for (const t of TOPICS) {
    assert.equal(t.status, "live", `topic "${t.id}" is not live`);
    assert.equal(typeof t.dataFile, "string", `topic "${t.id}" has no dataFile`);
    assert.ok(t.dataFile.length > 0, `topic "${t.id}" has an empty dataFile`);
  }
});

test("the 5 live ids are the expected set", () => {
  const liveIds = TOPICS.filter((t) => t.status === "live").map((t) => t.id);
  assert.deepEqual(
    new Set(liveIds),
    new Set(["israeli-football", "world-cup", "premier-league", "la-liga", "champions-league"]),
  );
});

test("every status is either 'live' or 'soon'", () => {
  for (const t of TOPICS) {
    assert.ok(["live", "soon"].includes(t.status), `topic "${t.id}" has status "${t.status}"`);
  }
});
