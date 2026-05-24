import { applyCSS, removeActiveStyle, removeFouc } from "./css";
import { createHost } from "./mount";
import { makeObserver } from "./observer";
import { sameShape, scanBlocks } from "./scan";
import { defaults, mergeState, resolveState, syncURL, writeStorage } from "./state";
import type { BlocksMap, State } from "./types";

const TOKEN_PARAM = "vp_token";

function getToken(): string | null {
  try {
    return new URL(location.href).searchParams.get(TOKEN_PARAM);
  } catch {
    return null;
  }
}

export function boot(): void {
  const token = getToken();
  if (!token) return;

  let blocks: BlocksMap = scanBlocks();
  if (blocks.size === 0) return;

  const storageKey = `__optio:${token}`;
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
    onReset() {
      state = defaults(blocks);
      applyCSS(state);
      syncURL(state);
      writeStorage(storageKey, state);
      host.rerender(blocks, state);
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
