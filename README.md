# Whichly

A tool that lets you ship multiple variants of a site block to
a real staging environment so a client can pick one before launch.

The dev writes variants in code, the client opens a staging link with a token, flips between
the variants live on the actual page, and leaves a choice plus comments. The dev reads the
feedback in a dashboard. That's the whole loop.

This is **not** Figma (variants live in real code on a real site, not in mockups), not A/B
testing (the goal is agreement with one client, not statistics over traffic), and not a
sandbox (variants render in the context of the real site with its real styles, data, and
integrations)

## Layout

```
whichly/
├── apps/
│   ├── web/         whichly.dev          — marketing landing (Next.js 16)
│   ├── docs/        docs.whichly.dev     — public docs (Fumadocs on Next.js 16)
│   └── dashboard/   app.whichly.dev      — auth-gated dashboard + API (Next.js 16)
├── packages/
│   ├── ui/          @whichly/ui          — shadcn components + Tailwind v4 base styles
│   ├── runtime/     @whichly/runtime     — the IIFE bundle clients load on their site
│   └── react/       @whichly/react       — the `<Variant>` component devs use in their code
├── biome.json
├── portless.json        — local HTTPS subdomains for dev
├── tsconfig.base.json
├── pnpm-workspace.yaml
└── package.json
```

Three apps because each one ships under its own subdomain and has its own deploy. Three
packages because they have three different consumers: the apps consume `@whichly/ui`, the
client site loads `@whichly/runtime` from the CDN, and the client codebase imports `@whichly/react`
from npm.

## Requirements

- **Node 24** (see `.nvmrc` — `nvm use` if you have nvm). Portless needs 24+.
- **pnpm 9** (Corepack will pin this for you via the `packageManager` field in `package.json`).
- First `pnpm dev` will prompt for your sudo password — Portless needs it once to bind port
  443 and trust the local CA it generates. Subsequent runs are passwordless.

## Getting started

```bash
nvm use          # picks Node 24
pnpm install     # installs everything, portless included
pnpm dev         # starts all 3 apps under https://*.whichly.localhost
                 # → first run will ask for your sudo password
```

Local URLs:
- `web`       → https://whichly.localhost
- `dashboard` → https://app.whichly.localhost
- `docs`      → https://docs.whichly.localhost

Underneath, Portless runs each app on its own loopback port (3000/3001/3002 from
`portless.json#apps.*.appPort`) and reverse-proxies HTTPS to it. If you want to bypass the
proxy for a quick sanity check, `pnpm --filter @whichly/web dev` still works — it'll just
listen on plain `http://localhost:3000`.

The package filters also work for `build`, `typecheck`, and `lint`.

## Building

```bash
pnpm build              # packages first, then apps
pnpm build:packages     # just packages/*
pnpm build:apps         # just apps/*
```

Each package builds to its own `dist/`:
- `packages/runtime/dist/whichly.js` — single-file IIFE, exposes `window.Whichly`. This is what
  Coolify Nginx serves at `cdn.whichly.dev/whichly.js`.
- `packages/react/dist/` — ESM + CJS + `.d.ts`. This is what gets published to npm as
  `@whichly/react`.
- `packages/ui/` doesn't build — it ships `.tsx` source through `package.json#exports` and
  apps transpile it via `transpilePackages: ["@whichly/ui"]`.

## Checks

```bash
pnpm typecheck    # runs tsc --noEmit in every workspace
pnpm lint         # biome check .
pnpm format       # biome format --write .
```

Biome is the only lint/format tool. No ESLint, no Prettier.

## Adding a shadcn component

shadcn is wired up the way their docs recommend for monorepos: the registry lives in
`packages/ui`, and each app has its own `components.json` that points the aliases at
`@whichly/ui/*`. So when you run `shadcn add` from inside an app, the component lands in
`packages/ui/src/components/` and is immediately importable from every app.

```bash
cd apps/dashboard
pnpm dlx shadcn@latest add button
# → packages/ui/src/components/button.tsx
```

Then in code:

```tsx
import { Button } from "@whichly/ui/components/button";
```

Theme tokens (colors, radius, dark mode) live in `packages/ui/src/styles/globals.css`. Each
app imports them via `@import "@whichly/ui/globals.css"` from its own `app/globals.css`.

## Adding docs pages

MDX files go in `apps/docs/content/docs/`. The `meta.json` next to them controls the sidebar
order. Restart `pnpm --filter @whichly/docs dev` if you add a new file and it doesn't show up
(the MDX runtime regenerates `.source/` on boot).

## Working on the runtime bundle

`packages/runtime` builds with Vite in lib mode and emits a single IIFE file. To iterate:

```bash
pnpm --filter @whichly/runtime dev     # vite build --watch
```

The bundle is intentionally tiny (Preact + Shadow DOM, no React). The entry exposes
`window.Whichly.mount(el, { token })` and that's the contract clients use in their
`<script src="https://cdn.whichly.dev/whichly.js">` tag