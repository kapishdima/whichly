export interface MountOptions {
  token: string;
}

export interface MountHandle {
  destroy(): void;
}

export function mount(target: HTMLElement, _options: MountOptions): MountHandle {
  const shadow = target.attachShadow({ mode: "open" });
  const root = document.createElement("div");
  root.dataset.optioRuntime = "";
  shadow.appendChild(root);

  return {
    destroy() {
      while (shadow.firstChild) {
        shadow.removeChild(shadow.firstChild);
      }
    },
  };
}
