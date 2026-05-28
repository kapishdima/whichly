![Whichly — Let your clients choose for themselves](apps/web/public/hero.png)

# Whichly

Live variant picker for React. Wrap blocks in `<Block>` / `<Variant>`, deploy to a staging
URL, and let clients toggle between variants live — on the real page, in the real layout,
with real data. The selected variants are encoded in the URL (`?vp=block:variant,...`), so any
combination is just a shareable link.

There is **no backend, no dashboard, and no auth** — just one React npm package. The picker
mounts into a Shadow DOM, so its styles never leak in or out of the host page.

This is **not** Figma (variants live in real code on a real site, not in mockups), not A/B
testing (the goal is agreement with one client, not statistics over traffic), and not a
sandbox (variants render in the context of the real site with its real styles, data, and
integrations).

## Installation

```bash
# pnpm
pnpm add @whichly/react

# npm
npm install @whichly/react

# yarn
yarn add @whichly/react
```

Whichly works with **React 18 and 19** (declared as peer dependencies). The package ships its
own type declarations — no `@types/*` needed.

The picker UI ships its styles **inlined and scoped to a shadow DOM**, so there is nothing to
import and nothing to configure in Tailwind or your global CSS.

## Usage

There are three pieces:

1. **`WhichlyProvider`** — wraps your app, holds the variant state, and renders the picker.
2. **`Block`** — a named group of mutually-exclusive variants.
3. **`Variant`** — one option inside a block.

Wrap your app (or any subtree) in `WhichlyProvider`, then wrap each swappable region in a named
`Block` containing one or more named `Variant`s. A floating picker appears so you can switch the
active variant.

```tsx
import { WhichlyProvider, Block, Variant } from "@whichly/react";

export default function Page() {
  return (
    <WhichlyProvider>
      <Block name="Hero">
        <Variant name="Bold">
          <h1>Ship faster.</h1>
        </Variant>
        <Variant name="Friendly">
          <h1>Let's build something great together.</h1>
        </Variant>
      </Block>
    </WhichlyProvider>
  );
}
```

The **first variant is active by default**. As you switch variants, Whichly writes your
selection into the URL:

```
https://staging.example.com/?vp=Hero:Friendly
```

Copy that link and send it to your client — when they open it, the page loads with the
`Friendly` hero already selected.

### Multiple blocks

Add as many blocks as you like. Each gets its own stepper in the picker and its own segment in
the URL (e.g. `?vp=Hero:Friendly,CTA:Subtle`).

```tsx
<WhichlyProvider>
  <Block name="Hero">
    <Variant name="Bold">{/* ... */}</Variant>
    <Variant name="Friendly">{/* ... */}</Variant>
  </Block>

  <Block name="CTA">
    <Variant name="Primary">
      <button>Get started</button>
    </Variant>
    <Variant name="Subtle">
      <a href="/signup">Sign up →</a>
    </Variant>
  </Block>
</WhichlyProvider>
```

### Preselecting variants

Pass `initialState` to choose which variant is active before any URL is applied (the URL still
takes precedence when present):

```tsx
<WhichlyProvider initialState={{ Hero: "Friendly" }}>{/* ... */}</WhichlyProvider>
```

### Placing the picker yourself

By default the provider renders a floating dock pinned to the bottom of the viewport. To place
the picker somewhere specific in your layout, set `floating={false}` and drop a
`<WhichlyPicker>` wherever you want it:

```tsx
import { WhichlyProvider, WhichlyPicker, Block, Variant } from "@whichly/react";

<WhichlyProvider floating={false}>
  <header>
    <WhichlyPicker />
  </header>

  <Block name="Hero">{/* ... */}</Block>
</WhichlyProvider>;
```

### Next.js / RSC

`WhichlyProvider`, `Block`, and `Variant` are client components (`"use client"`). Server
Components can import and render `Block` / `Variant` directly. `Block` and `Variant` are also
available under a `Whichly` namespace, which reads nicer in larger trees — but the namespaced
form only works from client components.

```tsx
import { Whichly } from "@whichly/react";

<Whichly.Block name="Hero">
  <Whichly.Variant name="Bold">{/* ... */}</Whichly.Variant>
</Whichly.Block>;
```

Full documentation lives at [docs.whichly.dev](https://docs.whichly.dev).

## Repository layout

```
whichly/
├── apps/
│   ├── web/      whichly.dev        — marketing landing (Next.js, dog-foods @whichly/react)
│   └── docs/     docs.whichly.dev   — public docs (Fumadocs on Next.js)
├── packages/
│   └── react/    @whichly/react     — the library published to npm
├── biome.json
├── tsconfig.base.json
├── pnpm-workspace.yaml
└── package.json
```

## Development

Requires **Node 24** (see `.nvmrc`) and **pnpm 9** (pinned via `packageManager` in
`package.json`).

```bash
pnpm install     # install everything
pnpm dev         # run all workspaces in parallel
```

`pnpm dev` also works per workspace, e.g. `pnpm --filter @whichly/react dev` or
`pnpm --filter @whichly/web dev`.

### Building

```bash
pnpm build              # packages first, then apps
pnpm build:packages     # just packages/*
pnpm build:apps         # just apps/*
```

`packages/react` builds to `dist/` (ESM + CJS + `.d.ts`) and is what gets published to npm.

### Checks

```bash
pnpm typecheck    # tsc --noEmit in every workspace
pnpm lint         # biome check .
pnpm format       # biome format --write .
```

Biome is the only lint/format tool — no ESLint, no Prettier.

### Adding docs pages

MDX files go in `apps/docs/content/docs/`. The `meta.json` next to them controls the sidebar
order. Restart `pnpm --filter @whichly/docs dev` if a new file doesn't show up (the MDX runtime
regenerates `.source/` on boot).

## License

MIT © kapishdima
