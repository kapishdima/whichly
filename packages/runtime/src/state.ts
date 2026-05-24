import type { BlocksMap, State } from "./types";

const URL_PARAM = "vp";

export function defaults(blocks: BlocksMap): State {
  const state: State = {};
  for (const [block, variants] of blocks) {
    const first = variants[0];
    if (first !== undefined) state[block] = first;
  }
  return state;
}

export function parseUrl(href: string = location.href): State | null {
  try {
    const raw = new URL(href).searchParams.get(URL_PARAM);
    if (!raw) return null;
    const state: State = {};
    for (const pair of raw.split(",")) {
      const idx = pair.indexOf(":");
      if (idx <= 0) continue;
      const block = pair.slice(0, idx);
      const variant = pair.slice(idx + 1);
      if (block && variant) state[block] = variant;
    }
    return Object.keys(state).length > 0 ? state : null;
  } catch {
    return null;
  }
}

export function serializeUrl(state: State): string {
  return Object.entries(state)
    .map(([block, variant]) => `${block}:${variant}`)
    .join(",");
}

export function syncURL(state: State): void {
  try {
    const url = new URL(location.href);
    const serialized = serializeUrl(state);
    if (serialized) {
      url.searchParams.set(URL_PARAM, serialized);
    } else {
      url.searchParams.delete(URL_PARAM);
    }
    history.replaceState(history.state, "", url.toString());
  } catch {
    // location can be cross-origin restricted in some sandboxed iframes; ignore.
  }
}

export function readStorage(key: string): State | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const state: State = {};
    for (const [block, variant] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof variant === "string") state[block] = variant;
    }
    return Object.keys(state).length > 0 ? state : null;
  } catch {
    return null;
  }
}

export function writeStorage(key: string, state: State): void {
  try {
    localStorage.setItem(key, JSON.stringify(state));
  } catch {
    // Storage may be disabled (Safari private mode etc.); silently no-op.
  }
}

export function resolveState(blocks: BlocksMap, storageKey: string): State {
  const base = defaults(blocks);
  const fromUrl = parseUrl();
  const fromStorage = fromUrl ? null : readStorage(storageKey);
  const overlay = fromUrl ?? fromStorage ?? {};
  return mergeState({ ...base, ...overlay }, blocks);
}

export function mergeState(prev: State, blocks: BlocksMap): State {
  const next: State = {};
  for (const [block, variants] of blocks) {
    const previous = prev[block];
    next[block] = previous && variants.includes(previous) ? previous : (variants[0] ?? "");
  }
  return next;
}
