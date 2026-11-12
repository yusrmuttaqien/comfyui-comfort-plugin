// Types for the ComfyUI API client at /scripts/api.js (the same singleton
// instance in both renderers). Only the surface this plugin uses is declared.
export const api: {
  // num: -1 for a normal prompt; the returned object carries `prompt_id`.
  queuePrompt(num: number, prompt: any, options?: any): Promise<{ prompt_id: string } & Record<string, any>>;
  addEventListener(type: string, listener: (e: CustomEvent<any>) => void): void;
  removeEventListener(type: string, listener: (e: CustomEvent<any>) => void): void;
};
