import { API_URL } from "./config";
import { applyCSS, removeActiveStyle, removeFouc } from "./css";
import { createHost } from "./mount";
import { makeObserver } from "./observer";
import { sameShape, scanBlocks } from "./scan";
import { mergeState, resolveState, syncURL, writeStorage } from "./state";
import type { BlocksMap, State } from "./types";

function getProjectId(): string | null {
  for (const s of document.querySelectorAll<HTMLScriptElement>("script[data-project-id]")) {
    if (s.src.includes("optio")) {
      return s.dataset.projectId ?? null;
    }
  }
  return null;
}

export function boot(): void {
  const projectId = getProjectId();
  if (!projectId) return;

  let blocks: BlocksMap = scanBlocks();
  if (blocks.size === 0) return;

  const storageKey = `__optio:${projectId}`;
  let state: State = resolveState(blocks, storageKey);

  removeFouc();
  applyCSS(state);
  syncURL(state);

  const host = createHost({
    onSelect(block, variant) {
      state = { ...state, [block]: variant };
      applyCSS(state);
      syncURL(state);
      writeStorage(storageKey, state);
      host.rerender(blocks, state);
    },
    onResetBlock(block) {
      const first = blocks.get(block)?.[0];
      if (first === undefined) return;
      state = { ...state, [block]: first };
      applyCSS(state);
      syncURL(state);
      writeStorage(storageKey, state);
      host.rerender(blocks, state);
    },
    async onReview(items) {
      const response = await fetch(`${API_URL}/api/reviews`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ projectId, items }),
      });
      if (!response.ok) {
        throw new Error(`optio: review submit failed (${response.status})`);
      }
    },
  });
  host.rerender(blocks, state);

  makeObserver(() => {
    const next = scanBlocks();
    if (sameShape(blocks, next)) return;
    blocks = next;
    if (blocks.size === 0) {
      removeActiveStyle();
      host.destroy();
      return;
    }
    removeFouc();
    state = mergeState(state, blocks);
    applyCSS(state);
    syncURL(state);
    writeStorage(storageKey, state);
    host.rerender(blocks, state);
  });
}
