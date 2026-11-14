// Auto-nest combo menus: break flat lists with subdirectory entries into folder submenus.
// Re-worked from rgthree-comfy (MIT).

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


  const newOptions = Object.assign({}, options);
  newOptions.callback = undefined;
  return { values: newValues, options: newOptions };
}

function maybeNest(values: any, options: any): { values: any; options: any } {
  if (!Array.isArray(values) || values.length < NEST_THRESHOLD) return { values, options };
  if (options?.className !== "dark") return { values, options };

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
