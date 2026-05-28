"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Picker } from "./picker";
import pickerCss from "./picker/picker.css?inline";
import { ShadowRootContext } from "./picker/shadow-context";
import { useWhichlyPicker } from "./provider";

export interface WhichlyPickerProps {
  className?: string;
}

interface InlineMount {
  shadow: ShadowRoot;
  portalEl: HTMLDivElement;
}

/**
 * Renders the variant picker inline, in normal document flow, wherever it is
 * placed — instead of the floating dock. Pair with `<WhichlyProvider floating={false}>`.
 * Keep it outside your `<Block>` so it stays mounted across variant switches.
 */
export function WhichlyPicker({ className }: WhichlyPickerProps) {
  const { blocks, state, select, reset } = useWhichlyPicker();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState<InlineMount | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const host = document.createElement("div");
    const shadow = host.attachShadow({ mode: "open" });
    const styleEl = document.createElement("style");
    styleEl.textContent = pickerCss;
    shadow.appendChild(styleEl);

    const portalEl = document.createElement("div");
    portalEl.className = "dark";
    shadow.appendChild(portalEl);

    container.appendChild(host);
    setMount({ shadow, portalEl });

    return () => {
      host.remove();
      setMount(null);
    };
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {mount &&
        createPortal(
          <ShadowRootContext.Provider value={mount.shadow}>
            <Picker blocks={blocks} state={state} onSelect={select} onReset={reset} anchored />
          </ShadowRootContext.Provider>,
          mount.portalEl,
        )}
    </div>
  );
}
