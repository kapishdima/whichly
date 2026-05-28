"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { sortByDocumentPosition } from "./ordering";
import { Picker } from "./picker";
import pickerCss from "./picker/picker.css?inline";
import { ShadowRootContext } from "./picker/shadow-context";
import { parseUrl, type State, syncURL } from "./url";

type InstanceId = string;
type Registry = Map<string, Map<InstanceId, string[]>>;

interface OptioContextValue {
  register(block: string, instanceId: InstanceId, variants: string[]): void;
  unregister(block: string, instanceId: InstanceId): void;
  getActive(block: string): string | undefined;
}

const OptioContext = createContext<OptioContextValue | null>(null);

export function useOptio(): OptioContextValue {
  const ctx = useContext(OptioContext);
  if (!ctx) {
    throw new Error("<Optio.Block> must be rendered inside <OptioProvider>");
  }
  return ctx;
}

export interface OptioProviderProps {
  initialState?: State;
  children?: ReactNode;
}

interface ShadowMount {
  host: HTMLDivElement;
  shadow: ShadowRoot;
  portalEl: HTMLDivElement;
}

function flattenRegistry(reg: Registry): Map<string, string[]> {
  const out = new Map<string, string[]>();
  for (const [block, byInstance] of reg) {
    const merged: string[] = [];
    for (const variants of byInstance.values()) {
      for (const v of variants) {
        if (!merged.includes(v)) merged.push(v);
      }
    }
    if (merged.length > 0) out.set(block, merged);
  }
  return out;
}

export function OptioProvider({ initialState, children }: OptioProviderProps) {
  const [registry, setRegistry] = useState<Registry>(() => new Map());
  const [state, setState] = useState<State>(() => initialState ?? {});
  const [mount, setMount] = useState<ShadowMount | null>(null);

  useEffect(() => {
    const fromUrl = parseUrl();
    if (Object.keys(fromUrl).length > 0) {
      setState((prev) => ({ ...prev, ...fromUrl }));
    }
  }, []);

  useEffect(() => {
    const host = document.createElement("div");
    host.id = "__optio_picker_host";
    host.style.cssText = [
      "position:fixed",
      "left:0",
      "right:0",
      "bottom:0",
      "height:0",
      "z-index:2147483647",
      "pointer-events:none",
    ].join(";");

    const shadow = host.attachShadow({ mode: "open" });
    const styleEl = document.createElement("style");
    styleEl.textContent = pickerCss;
    shadow.appendChild(styleEl);

    const portalEl = document.createElement("div");
    portalEl.className = "dark";
    shadow.appendChild(portalEl);

    document.body.appendChild(host);
    setMount({ host, shadow, portalEl });

    return () => {
      host.remove();
      setMount(null);
    };
  }, []);

  const register = useCallback((block: string, instanceId: InstanceId, variants: string[]) => {
    setRegistry((prev) => {
      const next = new Map(prev);
      const inner = new Map(next.get(block) ?? []);
      inner.set(instanceId, variants);
      next.set(block, inner);
      return next;
    });
  }, []);

  const unregister = useCallback((block: string, instanceId: InstanceId) => {
    setRegistry((prev) => {
      const inner = prev.get(block);
      if (!inner || !inner.has(instanceId)) return prev;
      const next = new Map(prev);
      const newInner = new Map(inner);
      newInner.delete(instanceId);
      if (newInner.size === 0) next.delete(block);
      else next.set(block, newInner);
      return next;
    });
  }, []);

  const flat = useMemo(() => flattenRegistry(registry), [registry]);

  const getActive = useCallback(
    (block: string): string | undefined => {
      const variants = flat.get(block);
      if (!variants || variants.length === 0) return undefined;
      const preferred = state[block];
      if (preferred && variants.includes(preferred)) return preferred;
      return variants[0];
    },
    [flat, state],
  );

  const select = useCallback((block: string, variant: string) => {
    setState((prev) => {
      const next = { ...prev, [block]: variant };
      syncURL(next);
      return next;
    });
  }, []);

  const reset = useCallback(
    (block: string) => {
      const variants = flat.get(block);
      const first = variants?.[0];
      if (!first) return;
      setState((prev) => {
        const next = { ...prev, [block]: first };
        syncURL(next);
        return next;
      });
    },
    [flat],
  );

  const sortedBlocks = useMemo(() => sortByDocumentPosition(flat), [flat]);

  const pickerState = useMemo<State>(() => {
    const out: State = {};
    for (const [block, variants] of sortedBlocks) {
      const preferred = state[block];
      out[block] = preferred && variants.includes(preferred) ? preferred : (variants[0] ?? "");
    }
    return out;
  }, [sortedBlocks, state]);

  const contextValue = useMemo<OptioContextValue>(
    () => ({ register, unregister, getActive }),
    [register, unregister, getActive],
  );

  return (
    <OptioContext.Provider value={contextValue}>
      {children}
      {mount &&
        createPortal(
          <ShadowRootContext.Provider value={mount.shadow}>
            <Picker
              blocks={sortedBlocks}
              state={pickerState}
              onSelect={select}
              onReset={reset}
            />
          </ShadowRootContext.Provider>,
          mount.portalEl,
        )}
    </OptioContext.Provider>
  );
}
