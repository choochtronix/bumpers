// Idle-shutdown policy for expensive long-lived resources (currently the
// Playwright Chromium the Mercari connector keeps resident).
//
// Kept pure — timers are injectable — so the policy can be unit tested without
// launching a browser. server.js owns the resource; this owns only the "is it
// safe to release yet" decision.
//
// The rule: never arm the timer while work is in flight, and re-check the
// in-flight count when it fires, so a search that starts mid-countdown can
// never have the browser closed underneath it.
export function createIdleShutdown({ idleMs, onIdle, timers } = {}) {
  const setTimeoutFn = timers?.setTimeout || setTimeout;
  const clearTimeoutFn = timers?.clearTimeout || clearTimeout;
  let timer = null;
  let active = 0;

  function cancel() {
    if (timer !== null) {
      clearTimeoutFn(timer);
      timer = null;
    }
  }

  function schedule() {
    cancel();
    // A non-positive idleMs disables shutdown entirely (keep the resource warm).
    if (!(Number(idleMs) > 0)) return;
    if (active > 0) return;
    timer = setTimeoutFn(() => {
      timer = null;
      if (active > 0) return; // a late starter won; its end() re-arms us
      onIdle();
    }, idleMs);
    // Never hold the process open just to close a browser later.
    timer?.unref?.();
  }

  return {
    // Call before touching the resource.
    begin() {
      active += 1;
      cancel();
    },
    // Call in a finally block once the work is done.
    end() {
      active = Math.max(0, active - 1);
      if (active === 0) schedule();
    },
    cancel,
    get activeCount() {
      return active;
    },
    get isArmed() {
      return timer !== null;
    },
  };
}
