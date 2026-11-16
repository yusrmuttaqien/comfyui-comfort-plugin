// Shared title-change tracking for comfort nodes that display the titles of
// other graph objects (connected nodes, groups). Zero polling: each source
// object gets a one-time `title` property interceptor, and actual changes are
// coalesced into a single animation-frame refresh of every dependent node.

const deps = new Set<any>();
const hooked = new WeakSet<any>();
let pending = false;

/** Register a comfort node to be refreshed when a watched title changes. */
export function trackTitleDep(node: any): void {
  deps.add(node);
}

export function untrackTitleDep(node: any): void {
  deps.delete(node);
}

/**
 * Install a `title` interceptor on a source object (node or group). Safe to
 * call repeatedly; the hook is installed once per object. The interceptor
 * fires for any assignment (UI rename, workflow load, scripts), so no
 * polling is needed.
 */
export function watchTitle(source: any): void {
  if (!source || hooked.has(source)) return;
  hooked.add(source);
  let value = source.title;
  try {
    Object.defineProperty(source, "title", {
      configurable: true,
      enumerable: true,
      get: () => value,
      set: (v: any) => {
        if (v === value) return;
        value = v;
        scheduleRefresh();
      },
    });
  } catch {
    /* not hookable — title updates fall back to the next structural refresh */
  }
}

function scheduleRefresh(): void {
  if (pending) return;
  pending = true;
  const run = (): void => {
    pending = false;
    for (const dep of [...deps]) {
      try {
        dep.refreshTitleRows?.();
      } catch {
        /* one dep's error must not break the others */
      }
    }
  };
  if (typeof requestAnimationFrame === "function") requestAnimationFrame(run);
  else setTimeout(run, 16);
}
