import type { AstroIntegration } from "astro";

export { default as WhichlyBlock } from "../components/WhichlyBlock.astro";
export { default as WhichlyVariant } from "../components/WhichlyVariant.astro";

export interface WhichlyAstroOptions {
  /**
   * Render the built-in floating picker.
   * @default true
   */
  floating?: boolean;
  /**
   * URL search param used to store selections.
   * @default "vp"
   */
  param?: string;
}

export default function whichly(options: WhichlyAstroOptions = {}): AstroIntegration {
  return {
    name: "@whichly/astro",
    hooks: {
      "astro:config:setup": ({ injectScript }) => {
        const runtimeOptions = JSON.stringify(options).replaceAll("<", "\\u003c");
        injectScript(
          "page",
          `import { createWhichlyRuntime } from "@whichly/astro/runtime";\ncreateWhichlyRuntime(${runtimeOptions});`,
        );
      },
    },
  };
}
