import { DEFAULT_URL_PARAM, type State, parseUrl, syncURL } from "./url";

export interface WhichlyRuntimeOptions {
  root?: ParentNode;
  floating?: boolean;
  param?: string;
}

export interface WhichlyRuntime {
  readonly blocks: Map<string, string[]>;
  readonly state: State;
  scan(): void;
  select(block: string, variant: string): void;
  reset(block: string): void;
  subscribe(listener: () => void): () => void;
  destroy(): void;
}

type Listener = () => void;

const BLOCK_SELECTOR = "[data-whichly-block], [data-vp-block]";
const VARIANT_SELECTOR = "[data-whichly-variant], [data-vp-variant]";

const pickerCss = `
:host { all: initial; color-scheme: dark; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
* { box-sizing: border-box; }
.whichly-wrap { position: fixed; left: 0; right: 0; bottom: 5vh; z-index: 2147483647; display: flex; justify-content: center; padding: 0 16px; pointer-events: none; }
.whichly-dock { pointer-events: auto; display: flex; min-width: 0; max-width: 100%; align-items: center; gap: 14px; border-radius: 999px; background: #09090b; color: #fafafa; padding: 6px 8px 6px 16px; box-shadow: 0 16px 48px rgba(0,0,0,.45); border: 1px solid rgba(255,255,255,.1); }
.whichly-title { font-size: 14px; font-weight: 700; white-space: nowrap; }
.whichly-list { display: flex; min-width: 0; flex: 1; align-items: center; gap: 10px; overflow-x: auto; padding: 2px 0; scrollbar-width: none; }
.whichly-list::-webkit-scrollbar { display: none; }
.whichly-stepper { display: inline-flex; flex-shrink: 0; align-items: center; gap: 4px; border-radius: 999px; border: 1px solid rgba(255,255,255,.12); background: #18181b; padding: 4px 6px 4px 12px; }
.whichly-block { max-width: 96px; overflow: hidden; padding-right: 6px; color: #a1a1aa; font-size: 12px; text-overflow: ellipsis; white-space: nowrap; }
.whichly-current { min-width: 80px; max-width: 160px; overflow: hidden; padding: 0 2px; text-align: center; color: #fafafa; font-size: 13px; font-weight: 600; text-overflow: ellipsis; white-space: nowrap; }
button { appearance: none; border: 0; border-radius: 999px; background: transparent; color: #fafafa; cursor: pointer; display: inline-grid; height: 28px; min-width: 28px; place-items: center; padding: 0 8px; font: inherit; }
button:hover { background: rgba(255,255,255,.09); }
button.whichly-reset:hover { background: rgba(239,68,68,.2); color: #fecaca; }
button.whichly-collapse { flex-shrink: 0; }
.whichly-fab { position: fixed; right: 16px; bottom: 5vh; z-index: 2147483647; width: 48px; height: 48px; border: 1px solid rgba(255,255,255,.1); background: #18181b; box-shadow: 0 16px 48px rgba(0,0,0,.35); pointer-events: auto; }
@media (max-width: 640px) { .whichly-wrap { bottom: max(12px, env(safe-area-inset-bottom)); padding: 0 8px; } .whichly-title { display: none; } .whichly-dock { gap: 8px; padding: 8px; } .whichly-fab { bottom: max(12px, env(safe-area-inset-bottom)); } }
`;

function getBlockName(el: Element): string | undefined {
  return (el as HTMLElement).dataset.whichlyBlock ?? (el as HTMLElement).dataset.vpBlock;
}

function getVariantName(el: Element): string | undefined {
  return (el as HTMLElement).dataset.whichlyVariant ?? (el as HTMLElement).dataset.vpVariant;
}

function wrap(list: string[], current: string, dir: 1 | -1): string {
  const len = list.length;
  if (len === 0) return current;
  const idx = list.indexOf(current);
  const start = idx === -1 ? 0 : idx;
  return list[(start + dir + len) % len] ?? current;
}

function isNestedInOtherBlock(variant: Element, block: Element): boolean {
  const parentBlock = variant.parentElement?.closest(BLOCK_SELECTOR);
  return parentBlock !== block;
}

export function createWhichlyRuntime(options: WhichlyRuntimeOptions = {}): WhichlyRuntime {
  const root = options.root ?? document;
  const param = options.param ?? DEFAULT_URL_PARAM;
  const floating = options.floating ?? true;
  const blocks = new Map<string, string[]>();
  let state: State = typeof location === "undefined" ? {} : parseUrl(location.href, param);
  const listeners = new Set<Listener>();
  let observer: MutationObserver | undefined;
  let host: HTMLDivElement | undefined;
  let shadow: ShadowRoot | undefined;
  let collapsed = false;

  function emit(): void {
    for (const listener of listeners) listener();
  }

  function getActive(block: string): string | undefined {
    const variants = blocks.get(block);
    if (!variants || variants.length === 0) return undefined;
    const preferred = state[block];
    if (preferred && variants.includes(preferred)) return preferred;
    return variants[0];
  }

  function applyState(): void {
    for (const blockEl of root.querySelectorAll<HTMLElement>(BLOCK_SELECTOR)) {
      const block = getBlockName(blockEl);
      if (!block) continue;
      const active = getActive(block);
      for (const variantEl of blockEl.querySelectorAll<HTMLElement>(VARIANT_SELECTOR)) {
        if (isNestedInOtherBlock(variantEl, blockEl)) continue;
        const variant = getVariantName(variantEl);
        variantEl.style.display = variant === active ? "contents" : "none";
      }
    }
  }

  function renderPicker(): void {
    if (!shadow) return;
    const existing = shadow.querySelector(".whichly-wrap, .whichly-fab");
    existing?.remove();

    if (blocks.size === 0) return;

    if (collapsed) {
      const button = document.createElement("button");
      button.className = "whichly-fab";
      button.type = "button";
      button.setAttribute("aria-label", "Expand Whichly picker");
      button.textContent = "⌁";
      button.addEventListener("click", () => {
        collapsed = false;
        renderPicker();
      });
      shadow.appendChild(button);
      return;
    }

    const wrapEl = document.createElement("div");
    wrapEl.className = "whichly-wrap";

    const dock = document.createElement("div");
    dock.className = "whichly-dock";
    dock.setAttribute("role", "toolbar");
    dock.setAttribute("aria-label", "Whichly variant picker");

    const title = document.createElement("div");
    title.className = "whichly-title";
    title.textContent = "Whichly";
    dock.appendChild(title);

    const list = document.createElement("div");
    list.className = "whichly-list";

    for (const [block, variants] of blocks) {
      const current = getActive(block) ?? "";
      const stepper = document.createElement("div");
      stepper.className = "whichly-stepper";

      const label = document.createElement("div");
      label.className = "whichly-block";
      label.title = block;
      label.textContent = block;
      stepper.appendChild(label);

      const prev = document.createElement("button");
      prev.type = "button";
      prev.setAttribute("aria-label", `Previous ${block} variant`);
      prev.textContent = "‹";
      prev.addEventListener("click", () => runtime.select(block, wrap(variants, current, -1)));
      stepper.appendChild(prev);

      const value = document.createElement("div");
      value.className = "whichly-current";
      value.title = current;
      value.setAttribute("aria-live", "polite");
      value.textContent = current;
      stepper.appendChild(value);

      const next = document.createElement("button");
      next.type = "button";
      next.setAttribute("aria-label", `Next ${block} variant`);
      next.textContent = "›";
      next.addEventListener("click", () => runtime.select(block, wrap(variants, current, 1)));
      stepper.appendChild(next);

      const reset = document.createElement("button");
      reset.type = "button";
      reset.className = "whichly-reset";
      reset.setAttribute("aria-label", `Reset ${block} variant`);
      reset.textContent = "↺";
      reset.addEventListener("click", () => runtime.reset(block));
      stepper.appendChild(reset);

      list.appendChild(stepper);
    }

    dock.appendChild(list);

    const collapse = document.createElement("button");
    collapse.type = "button";
    collapse.className = "whichly-collapse";
    collapse.setAttribute("aria-label", "Minimize picker");
    collapse.textContent = "−";
    collapse.addEventListener("click", () => {
      collapsed = true;
      renderPicker();
    });
    dock.appendChild(collapse);

    wrapEl.appendChild(dock);
    shadow.appendChild(wrapEl);
  }

  function scan(): void {
    blocks.clear();
    for (const blockEl of root.querySelectorAll<HTMLElement>(BLOCK_SELECTOR)) {
      const block = getBlockName(blockEl);
      if (!block) continue;
      const variants = blocks.get(block) ?? [];
      for (const variantEl of blockEl.querySelectorAll<HTMLElement>(VARIANT_SELECTOR)) {
        if (isNestedInOtherBlock(variantEl, blockEl)) continue;
        const variant = getVariantName(variantEl);
        if (variant && !variants.includes(variant)) variants.push(variant);
      }
      if (variants.length > 0) blocks.set(block, variants);
    }
    applyState();
    renderPicker();
    emit();
  }

  const runtime: WhichlyRuntime = {
    get blocks() {
      return new Map(blocks);
    },
    get state() {
      return { ...state };
    },
    scan,
    select(block, variant) {
      if (!blocks.get(block)?.includes(variant)) return;
      state = { ...state, [block]: variant };
      syncURL(state, param);
      applyState();
      renderPicker();
      emit();
    },
    reset(block) {
      const first = blocks.get(block)?.[0];
      if (!first) return;
      state = { ...state, [block]: first };
      syncURL(state, param);
      applyState();
      renderPicker();
      emit();
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    destroy() {
      observer?.disconnect();
      host?.remove();
      listeners.clear();
      blocks.clear();
    },
  };

  if (floating && typeof document !== "undefined") {
    host = document.createElement("div");
    host.id = "__whichly_picker_host";
    shadow = host.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = pickerCss;
    shadow.appendChild(style);
    document.body.appendChild(host);
  }

  scan();

  if (typeof MutationObserver !== "undefined") {
    observer = new MutationObserver(() => scan());
    observer.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: [
        "data-whichly-block",
        "data-whichly-variant",
        "data-vp-block",
        "data-vp-variant",
      ],
    });
  }

  return runtime;
}
