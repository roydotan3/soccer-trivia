import { test } from "node:test";
import assert from "node:assert/strict";
import { TOPICS } from "../game/js/topics.js";

test("TOPICS has exactly 5 entries", () => {
  assert.equal(TOPICS.length, 5);
});

test("exactly 2 entries have status 'live' and a dataFile path", () => {
  const live = TOPICS.filter((t) => t.status === "live");
  assert.equal(live.length, 2);
  for (const t of live) {
    assert.equal(typeof t.dataFile, "string");
    assert.ok(t.dataFile.length > 0);
  }
});

test("the 2 live entries' ids are 'israeli-football' and 'world-cup'", () => {
  const liveIds = TOPICS.filter((t) => t.status === "live").map((t) => t.id);
  assert.deepEqual(new Set(liveIds), new Set(["israeli-football", "world-cup"]));
});

test("the 3 non-live entries have status 'soon'", () => {
  const nonLive = TOPICS.filter((t) => t.status !== "live");
  assert.equal(nonLive.length, 3);
  for (const t of nonLive) {
    assert.equal(t.status, "soon");
  }
});
