// Base class for comfort virtual (frontend-only) nodes.
//
// Virtual nodes are registered with LiteGraph.registerNodeType and exist only
// on the frontend — no Python backend. They render natively in both the legacy
// LiteGraph renderer and the Nodes 2.0 Vue renderer.
//
// The one piece of fiddly dual-renderer work is intercepting `node.mode`
// assignments so we can fire `onModeChange`. In the Nodes 2.0 frontend `mode`
// is a prototype accessor backed by `_state.mode`; in legacy LiteGraph it's a
// plain data property. We delegate to whichever form is present.
//
// Re-worked from rgthree-comfy (MIT).

function findProtoPropDescriptor(obj: any, prop: string): PropertyDescriptor | undefined {
  let proto = Object.getPrototypeOf(obj);
  while (proto) {
    const desc = Object.getOwnPropertyDescriptor(proto, prop);
    if (desc) return desc;
    proto = Object.getPrototypeOf(proto);
  }
  return undefined;
}

export abstract class ComfortVirtualNode extends LGraphNode {
  /** True while a workflow is loading (construct → configure → connect). */
  configuring = true;
  /** True once the constructor has finished. */
  __constructed__ = false;
  /** True after the node has been removed from its graph. */
  removed = false;

  // Backing store for legacy frontends where `mode` is a plain property.
  private __comfort_mode?: number;

  constructor(title?: string) {
    super(title);
    // Ensure these exist so other extensions that inspect them don't break.
    this.widgets = this.widgets || [];
    this.properties = this.properties || {};

    this.installModeInterceptor();
    this.__constructed__ = true;
  }

  /**
   * Wrap `this.mode` so reads/writes go through us and `onModeChange` fires.
   * Delegates to the prototype accessor (Nodes 2.0) when present, else to a
   * private field (legacy LiteGraph).
   */
  private installModeInterceptor(): void {
    const protoMode = findProtoPropDescriptor(this, "mode");
    const readMode = (): number | undefined => {
      if (protoMode?.get) return protoMode.get.call(this);
      return this.__comfort_mode;
    };
    Object.defineProperty(this, "mode", {
      configurable: true,
      enumerable: true,
      get: readMode,
      set: (mode: number) => {
        const old = readMode();
        if (protoMode?.set) protoMode.set.call(this, mode);
        else this.__comfort_mode = mode;
        if (old !== mode) this.onModeChange(old, mode);
      },
    });
  }

  /** Called after the subclass finishes setting up slots/widgets. */
  protected constructed(): void {
    this.__constructed__ = true;
  }

  configure(info: any): void {
    this.configuring = true;
    super.configure(info);
    // Flip out of "configuring" on the next tick so the whole load sequence
    // (configure + link restore) is suppressed.
    setTimeout(() => {
      this.configuring = false;
    }, 0);
  }

  /** Fire when this node's own mode changes. Guard with `this.configuring`. */
  onModeChange(_from: number | undefined, _to: number): void {
    /* override */
  }

  /** Help HTML shown in the node's help dialog / menu. */
  getHelp(): string {
    return "";
  }

  onRemoved(): void {
    super.onRemoved?.();
    this.removed = true;
  }
}
