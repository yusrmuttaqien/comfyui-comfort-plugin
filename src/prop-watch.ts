// Shared property-change tracking for comfort nodes that display state of
// other graph objects (connected node titles/modes, group titles/modes).
// Zero polling: each (source object, property) pair gets a one-time
// interceptor, and actual changes are coalesced into a single
// animation-frame refresh of every dependent node.

type WatchedProp = "title" | "mode";

const deps = new Set<any>();
const hooked = new WeakMap<any, Set<WatchedProp>>();
let pending = false;

/** Register a comfort node to be refreshed when a watched property changes. */
export function trackDep(node: any): void {
  deps.add(node);
}

export function untrackDep(node: any): void {
  deps.delete(node);
}

/**
 * Install an interceptor on `source[prop]` ("title" or "mode"). Safe to call
 * repeatedly; each (object, property) pair is hooked once. The interceptor
 * fires for any assignment (UI rename/mute, workflow load, scripts), so no
 * polling is needed.
 *
 * Two hook shapes:
 *  - the property has an accessor (Nodes 2.0 `mode` on the prototype via
 *    `_state`, or a comfort node's own `mode` interceptor) — delegate get/set
 *    to it, so existing behavior (Vue reactivity, `onModeChange`) is kept;
 *  - the property is a plain value (legacy `mode`, `title`) — capture it and
 *    intercept assignments.
 */
export function watchProp(source: any, prop: WatchedProp): void {
  if (!source) return;
  let props = hooked.get(source);
  if (props?.has(prop)) return;
  if (!props) {
    props = new Set();
    hooked.set(source, props);
  }
  props.add(prop);
  try {
    hookProp(source, prop);
  } catch {
    /* not hookable — falls back to the next structural refresh */
  }
}

/** Structural change (group/node add/remove, drag, pan) — refresh all deps. */
export function notifyStructuralChange(): void {
  scheduleRefresh();
}

function findProtoPropDescriptor(
  obj: any,
  prop: string,
): PropertyDescriptor | undefined {
  let proto = Object.getPrototypeOf(obj);
  while (proto) {
    const d = Object.getOwnPropertyDescriptor(proto, prop);
    if (d) return d;
    proto = Object.getPrototypeOf(proto);
  }
  return undefined;
}

function hookProp(source: any, prop: string): void {
  const own = Object.getOwnPropertyDescriptor(source, prop);
  let delegateGet: any;
  let delegateSet: any;
  let captureValue = false;
  if (own) {
    if (own.get || own.set) {
      delegateGet = own.get;
      delegateSet = own.set;
    } else {
      captureValue = true; // own data property
    }
  } else {
    const protoDesc = findProtoPropDescriptor(source, prop);
    if (protoDesc && (protoDesc.get || protoDesc.set)) {
      delegateGet = protoDesc.get;
      delegateSet = protoDesc.set;
    } else {
      captureValue = true;
    }
  }

  if (!captureValue) {
    Object.defineProperty(source, prop, {
      configurable: true,
      enumerable: true,
      get: () => (delegateGet ? delegateGet.call(source) : undefined),
      set: (v: any) => {
        const cur = delegateGet ? delegateGet.call(source) : undefined;
        if (v === cur) return;
        if (delegateSet) delegateSet.call(source, v);
        scheduleRefresh();
      },
    });
  } else {
    let value = source[prop];
    Object.defineProperty(source, prop, {
      configurable: true,
      enumerable: true,
      get: () => value,
      set: (v: any) => {
        if (v === value) return;
        value = v;
        scheduleRefresh();
      },
    });
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
