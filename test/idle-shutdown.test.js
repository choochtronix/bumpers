// Policy checks for the Mercari browser idle shutdown. The whole point is that
// a long-lived Chromium is released when nobody is using it, and is NEVER
// closed while a search is in flight — so the races are what matter here.
import { test } from "node:test";
import assert from "node:assert/strict";

import { createIdleShutdown } from "../src/lib/idleShutdown.js";

// Minimal controllable clock so the policy can be tested without real waiting.
function createFakeTimers() {
  let nextId = 1;
  const pending = new Map();
  return {
    timers: {
      setTimeout: (fn, ms) => {
        const id = nextId++;
        pending.set(id, { fn, ms });
        return id;
      },
      clearTimeout: (id) => pending.delete(id),
    },
    fireAll() {
      const due = [...pending.entries()];
      pending.clear();
      for (const [, { fn }] of due) fn();
    },
    get pendingCount() {
      return pending.size;
    },
  };
}

test("closes once the last in-flight search finishes", () => {
  const clock = createFakeTimers();
  let closed = 0;
  const idle = createIdleShutdown({ idleMs: 1000, onIdle: () => { closed += 1; }, timers: clock.timers });

  idle.begin();
  assert.equal(idle.isArmed, false, "must not arm while work is in flight");
  idle.end();
  assert.equal(idle.isArmed, true);
  clock.fireAll();
  assert.equal(closed, 1);
});

test("never closes while a search is still running", () => {
  const clock = createFakeTimers();
  let closed = 0;
  const idle = createIdleShutdown({ idleMs: 1000, onIdle: () => { closed += 1; }, timers: clock.timers });

  idle.begin();
  idle.begin();
  idle.end();          // one finished, one still running
  assert.equal(idle.activeCount, 1);
  assert.equal(idle.isArmed, false);
  clock.fireAll();
  assert.equal(closed, 0, "browser must stay open while a search is active");
});

test("a search starting mid-countdown cancels the pending shutdown", () => {
  const clock = createFakeTimers();
  let closed = 0;
  const idle = createIdleShutdown({ idleMs: 1000, onIdle: () => { closed += 1; }, timers: clock.timers });

  idle.begin();
  idle.end();
  assert.equal(idle.isArmed, true);
  idle.begin();                       // new search arrives before the timer fires
  assert.equal(idle.isArmed, false);
  clock.fireAll();
  assert.equal(closed, 0);
  idle.end();
  clock.fireAll();
  assert.equal(closed, 1, "shutdown resumes once that search finishes");
});

test("idleMs of 0 disables shutdown entirely", () => {
  const clock = createFakeTimers();
  let closed = 0;
  const idle = createIdleShutdown({ idleMs: 0, onIdle: () => { closed += 1; }, timers: clock.timers });

  idle.begin();
  idle.end();
  assert.equal(idle.isArmed, false);
  assert.equal(clock.pendingCount, 0);
  clock.fireAll();
  assert.equal(closed, 0);
});

test("unbalanced end() calls cannot drive the count negative", () => {
  const clock = createFakeTimers();
  const idle = createIdleShutdown({ idleMs: 1000, onIdle: () => {}, timers: clock.timers });

  idle.end();
  idle.end();
  assert.equal(idle.activeCount, 0);
  idle.begin();
  assert.equal(idle.activeCount, 1);
  assert.equal(idle.isArmed, false, "a stray end() must not leave the browser closable mid-search");
});

test("cancel() stops a pending shutdown", () => {
  const clock = createFakeTimers();
  let closed = 0;
  const idle = createIdleShutdown({ idleMs: 1000, onIdle: () => { closed += 1; }, timers: clock.timers });

  idle.begin();
  idle.end();
  idle.cancel();
  clock.fireAll();
  assert.equal(closed, 0);
});
