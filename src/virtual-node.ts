// Base class for comfort virtual (frontend-only) nodes. Re-worked from rgthree-comfy (MIT).

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

  configuring = false;

  removed = false;


  private __comfort_mode?: number;

  constructor(title?: string) {
    super(title);

    this.widgets = this.widgets || [];
    this.properties = this.properties || {};

    // Frontend-only: skip in graphToPrompt so the backend never sees this class_type.
    this.isVirtualNode = true;

    this.installModeInterceptor();
  }


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

  configure(info: any): void {
    this.configuring = true;
    super.configure(info);
    this.configuring = false;
  }


  onModeChange(_from: number | undefined, _to: number): void {
    /* override */
  }


  getHelp(): string {
    return "";
  }

  onRemoved(): void {
    super.onRemoved?.();
    this.removed = true;
  }
}
