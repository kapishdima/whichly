export type State = Record<string, string>;

export const DEFAULT_URL_PARAM = "vp";

function decodePart(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function encodePart(value: string): string {
  return encodeURIComponent(value);
}

export function parseUrl(href: string = location.href, param = DEFAULT_URL_PARAM): State {
  try {
    const raw = new URL(href).searchParams.get(param);
    if (!raw) return {};

    const state: State = {};
    for (const pair of raw.split(",")) {
      const idx = pair.indexOf(":");
      if (idx <= 0) continue;
      const block = decodePart(pair.slice(0, idx));
      const variant = decodePart(pair.slice(idx + 1));
      if (block && variant) state[block] = variant;
    }
    return state;
  } catch {
    return {};
  }
}

export function serializeUrl(state: State): string {
  return Object.entries(state)
    .map(([block, variant]) => `${encodePart(block)}:${encodePart(variant)}`)
    .join(",");
}

export function syncURL(state: State, param = DEFAULT_URL_PARAM): void {
  try {
    const url = new URL(location.href);
    const serialized = serializeUrl(state);
    if (serialized) {
      url.searchParams.set(param, serialized);
    } else {
      url.searchParams.delete(param);
    }
    history.replaceState(history.state, "", url.toString());
  } catch {
    // location can be cross-origin restricted in sandboxed iframes; ignore
  }
}
