import type { State } from "./types";

const STYLE_ID = "__optio_active_style";
const FOUC_ATTR = "data-optio-fouc";

export function applyCSS(state: State): void {
  let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement("style");
    el.id = STYLE_ID;
    document.head.appendChild(el);
  }

  const rules = Object.entries(state).map(
    ([block, variant]) =>
      `[data-vp-block="${cssEscape(block)}"]:not([data-vp-variant="${cssEscape(variant)}"]) { display: none !important; }`,
  );
  el.textContent = rules.join("\n");
}

export function removeActiveStyle(): void {
  document.getElementById(STYLE_ID)?.remove();
}

export function removeFouc(): void {
  for (const el of document.querySelectorAll(`[${FOUC_ATTR}]`)) {
    el.remove();
  }
}

function cssEscape(value: string): string {
  return value.replace(/["\\]/g, "\\$&");
}
