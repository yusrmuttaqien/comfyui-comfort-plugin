// Auto-nest combo menus — when a combo widget's option list contains
// subdirectory-style entries (e.g. "checkpoints/model.safetensors"), break the
// flat list into folder submenus so long model pickers stay usable.
//
// Re-worked from rgthree-comfy's ContextMenuAutoNest (MIT). Works in both
// renderers because combo widgets open their menu through LiteGraph.ContextMenu
// in either case. We wrap the constructor (composing with ComfyUI's own menu
// filter, which uses the same wrapping technique) and only touch "dark" combo
// menus that exceed a threshold and actually contain subdirectories.

const NEST_THRESHOLD = 10;
const SEP = /[/\\]/;
const ORIGINAL_KEY = "__comfort_original";

function buildNested(values: any[], options: any): { values: any[]; options: any } {
  const originalCallback = options?.callback;

  const folders = new Map<string, { full: string; sub: string }[]>();
  const folderless: any[] = [];

  for (const v of values) {
    if (v == null) {
      folderless.push(v);
      continue;
    }
    const s = String(v);
    const sep = s.indexOf("/") > -1 ? "/" : "\\";
    const idx = s.indexOf(sep);
    if (idx > -1) {
      const folder = s.slice(0, idx);
      const sub = s.slice(idx + 1);
      if (!folders.has(folder)) folders.set(folder, []);
      folders.get(folder)!.push({ full: s, sub });
    } else {
      folderless.push(v);
    }
  }

  const leaf = (full: string, display: string) => ({
    content: display,
    [ORIGINAL_KEY]: full,
    callback: (item: any) => originalCallback?.(item[ORIGINAL_KEY]),
  });

  const newValues: any[] = [];
  // Folders first (alphabetical), then the entries that have no directory.
  const folderNames = [...folders.keys()].sort((a, b) => a.localeCompare(b));
  for (const name of folderNames) {
    const leaves = folders.get(name)!.map((e) => leaf(e.full, e.sub));
    newValues.push({
      content: `📁 ${name}`,
      has_submenu: true,
      callback: () => {},
      submenu: { options: leaves },
    });
  }
  for (const v of folderless) {
    if (typeof v === "string") newValues.push(leaf(v, v));
    else newValues.push(v);
  }

  // The per-item callbacks now carry the selection; clear the top-level one so
  // it doesn't fire twice.
  const newOptions = Object.assign({}, options);
  newOptions.callback = undefined;
  return { values: newValues, options: newOptions };
}

function maybeNest(values: any, options: any): { values: any; options: any } {
  if (!Array.isArray(values) || values.length < NEST_THRESHOLD) return { values, options };
  if (options?.className !== "dark") return { values, options };
  // Only flat string lists are eligible; already-nested menus are skipped.
  if (!values.every((v) => v == null || typeof v === "string")) return { values, options };
  if (!values.some((v) => typeof v === "string" && SEP.test(v))) return { values, options };
  return buildNested(values, options);
}

function installAutoNest(): void {
  const target = LiteGraph.ContextMenu as any;
  if (!target || target.__comfortAutoNest) return;

  const wrapped = new Proxy(target, {
    construct(t, args, newTarget) {
      const [values, options] = args as any[];
      const next = maybeNest(values, options);
      return Reflect.construct(t, [next.values, next.options], newTarget);
    },
    apply(t, thisArg, args) {
      const [values, options] = args as any[];
      const next = maybeNest(values, options);
      return t.call(thisArg, next.values, next.options);
    },
  });
  wrapped.__comfortAutoNest = true;
  (LiteGraph as any).ContextMenu = wrapped;
}

export { installAutoNest };
