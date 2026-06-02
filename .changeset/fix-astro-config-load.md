---
"@whichly/astro": patch
---

Fix Astro config failing to start with `Unknown file extension ".astro"`. The package entry no longer re-exports the `.astro` components, so importing the integration in `astro.config.mjs` no longer forces Node's ESM loader to read a `.astro` file. Import components via `@whichly/astro/components/WhichlyBlock.astro` as documented. Also fixed the published type declarations path (`dist/index.d.ts` / `dist/runtime.d.ts`).
