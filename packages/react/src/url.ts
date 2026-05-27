export type State = Record<string, string>;

const URL_PARAM = "vp";

export function parseUrl(href: string = location.href): State {
  try {
    const raw = new URL(href).searchParams.get(URL_PARAM);
    if (!raw) return {};
    const state: State = {};
    for (const pair of raw.split(",")) {
      const idx = pair.indexOf(":");
      if (idx <= 0) continue;
      const block = pair.slice(0, idx);
      const variant = pair.slice(idx + 1);
      if (block && variant) state[block] = variant;
    }
    return state;
  } catch {
    return {};
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
    // location can be cross-origin restricted in sandboxed iframes; ignore
  }
}
