import { render } from "preact";
import { Picker, type PickerProps } from "./picker";
import type { BlocksMap, State } from "./types";

const HOST_ID = "__optio_picker_host";
const FONT_LINK_ID = "__optio_fonts";
const FONT_HREF = "https://fonts.googleapis.com/css2?family=Oxanium:wght@200..800&display=swap";

export interface MountHandle {
  rerender(blocks: BlocksMap, state: State): void;
  destroy(): void;
}

export interface MountOptions {
  onSelect: PickerProps["onSelect"];
  onReset: PickerProps["onReset"];
}

function ensureFonts(): void {
  if (document.getElementById(FONT_LINK_ID)) return;
  const link = document.createElement("link");
  link.id = FONT_LINK_ID;
  link.rel = "stylesheet";
  link.href = FONT_HREF;
  document.head.appendChild(link);
}

export function createHost(options: MountOptions): MountHandle {
  ensureFonts();
  const host = document.createElement("div");
  host.id = HOST_ID;
  host.style.cssText = [
    "position: fixed",
    "bottom: 16px",
    "right: 16px",
    "z-index: 2147483647",
    "pointer-events: none",
  ].join(";");

  const shadow = host.attachShadow({ mode: "closed" });
  const root = document.createElement("div");
  shadow.appendChild(root);

  document.body.appendChild(host);

  return {
    rerender(blocks, state) {
      render(
        <Picker
          blocks={blocks}
          state={state}
          onSelect={options.onSelect}
          onReset={options.onReset}
        />,
        root,
      );
    },
    destroy() {
      render(null, root);
      host.remove();
    },
  };
}
