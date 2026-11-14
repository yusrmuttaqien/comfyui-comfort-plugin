const MODEL_CACHE_MS = 1000;

export type ModelInfo = { id: string; value: string };

export async function forward(
  url: string,
  body?: unknown,
  signal?: AbortSignal,
): Promise<{ status: number; body: any }> {
  const resp =
    body === undefined
      ? await fetch("/comfort/ninfer/forward?url=" + encodeURIComponent(url), { signal })
      : await fetch("/comfort/ninfer/forward", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, body }),
          signal,
        });
  const text = await resp.text();
  let parsed: any = text;
  try { parsed = JSON.parse(text); } catch { /* keep raw */ }
  return { status: resp.status, body: parsed };
}

const modelCache = new Map<string, { at: number; models: ModelInfo[] }>();
const inFlight = new Map<string, Promise<ModelInfo[]>>();

export async function fetchModels(
  base: string,
  useCache: boolean,
  signal?: AbortSignal,
): Promise<ModelInfo[]> {
  const key = base + "/v1/models";
  if (useCache) {
    const hit = modelCache.get(key);
    if (hit && Date.now() - hit.at < MODEL_CACHE_MS) return hit.models;
  }
  const pending = inFlight.get(key);
  if (pending) return pending;
  const p = (async () => {
    const r = await forward(key, undefined, signal);
    const data = r.body?.data;
    const models: ModelInfo[] = Array.isArray(data)
      ? data.map((m: any) => ({ id: String(m.id), value: String(m.status?.value ?? "") }))
      : [];
    modelCache.set(key, { at: Date.now(), models });
    return models;
  })().finally(() => inFlight.delete(key));
  inFlight.set(key, p);
  return p;
}

export function suspendModel(
  base: string,
  id: string,
  signal?: AbortSignal,
): Promise<{ status: number; body: any }> {
  return forward(base + "/v1/models/" + encodeURIComponent(id) + "/suspend", {}, signal);
}

export const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));
