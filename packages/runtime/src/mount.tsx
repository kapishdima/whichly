import { render } from "preact";
import { Picker, type PickerProps } from "./picker";
import type { BlocksMap, State } from "./types";

const HOST_ID = "__optio_picker_host";

export interface MountHandle {
  rerender(blocks: BlocksMap, state: State): void;
  destroy(): void;
}

export interface MountOptions {
  onSelect: PickerProps["onSelect"];
  onReset: PickerProps["onReset"];
}

export function createHost(options: MountOptions): MountHandle {
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
