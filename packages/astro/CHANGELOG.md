# @whichly/astro

## 1.0.1

### Patch Changes

- [`a8cf6b7`](https://github.com/kapishdima/whichly/commit/a8cf6b715edb7f8bbc9c7e0e4ebe7318753239ae) Thanks [@DimaDevelopment](https://github.com/DimaDevelopment)! - Fix Astro config failing to start with `Unknown file extension ".astro"`. The package entry no longer re-exports the `.astro` components, so importing the integration in `astro.config.mjs` no longer forces Node's ESM loader to read a `.astro` file. Import components via `@whichly/astro/components/WhichlyBlock.astro` as documented. Also fixed the published type declarations path (`dist/index.d.ts` / `dist/runtime.d.ts`).

## 1.0.0

### Major Changes

- publish astro package

- change astro peer deps

### Minor Changes

- [#1](https://github.com/kapishdima/whichly/pull/1) [`7c0fed1`](https://github.com/kapishdima/whichly/commit/7c0fed15fe69223f57bf968d668fe2187042e9cb) Thanks [@nickradford](https://github.com/nickradford)! - Add the framework-agnostic DOM runtime and first-class Astro integration/components for variant previews across Astro pages and islands.

### Patch Changes

- Updated dependencies [[`7c0fed1`](https://github.com/kapishdima/whichly/commit/7c0fed15fe69223f57bf968d668fe2187042e9cb)]:
  - @whichly/core@1.0.0
