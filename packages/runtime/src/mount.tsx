import { render } from "preact";
import { Picker, type PickerProps } from "./picker";
import type { BlocksMap, State } from "./types";

const HOST_ID = "__optio_picker_host";
const FONT_LINK_ID = "__optio_fonts";
const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Geist:wght@400..700&family=Oxanium:wght@200..800&display=swap";

export interface MountHandle {
  rerender(blocks: BlocksMap, state: State): void;
  destroy(): void;
}

export interface MountOptions {
  onSelect: PickerProps["onSelect"];
  onResetBlock: PickerProps["onResetBlock"];
  onReview?: PickerProps["onReview"];
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
    "left: 0",
    "right: 0",
    "bottom: 0",
    "height: 0",
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
          onResetBlock={options.onResetBlock}
          onReview={options.onReview}
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
