---
name: whichly
description: Wrap a JSX section in Whichly <Block>/<Variant> and generate distinct alternative variants (from scratch or from a shadcn registry). Use when the user wants to "make variants", "add a variant", "mark this block", "wrap this in a Block", or mentions Whichly variant authoring.
user-invocable: true
allowed-tools: Read, Edit, Write, Grep, Glob, Bash(pnpm *), Bash(npx *), Bash(git diff *)
---

# Whichly variant authoring

Whichly mounts a floating picker that lets a client flip between alternative
versions of a page section live on the real site. Developers wrap a section in
`<Block name="...">` and put each version in a `<Variant name="...">`. Writing
those variants by hand is slow — this skill does it for you.

This skill does two things in one pass:
1. **Wrap** an existing JSX section as a `<Block>` with its current markup as the
   `main` variant.
2. **Generate** N alternative variants — each a *distinct angle* (different
   layout + copy), or sourced from a shadcn registry block.

If the target is already wrapped in a `<Block>`, skip wrapping and just add
alternatives.

## Whichly API — facts you MUST get right

Import from the library:

```tsx
import { Block, Variant } from "@whichly/react";
```

- `<Block name="...">` requires a unique, concise `name` (shown in the picker;
  keep it short — labels truncate ~96px). It wraps one or more `<Variant>`.
- `<Variant name="...">` requires a `name` unique within the block. The first
  variant is the default. Names are auto-discovered at runtime from the `name`
  prop — no registration step.
- The active variant renders with `display: contents`; inactive ones with
  `display: none`. **Therefore: never add an extra layout wrapper around variant
  content** — each `<Variant>`'s children must be a drop-in replacement for the
  original content, so flex/grid parents stay intact.
- `Block`/`Variant` are already `"use client"` internally. Server Components can
  import and use them directly — **do NOT add a `"use client"` directive** to the
  host file just to wrap a section.
- State is URL-encoded as `?vp=Block:variant`. Nothing for you to do beyond
  naming.

## Naming convention

- Original markup → variant named **`main`**.
- Alternatives → **short, descriptive kebab-case** names that read well to a
  client in the picker: `benefit-led`, `social-proof`, `minimal`, `urgency`.
  Keep them short (labels truncate ~160px). Never positional (`v2`, `second`)
  unless the user asks.
- Block name → concise PascalCase reflecting the section: `Hero`, `Pricing`,
  `FAQ`.

## Where the Block goes — wrap content, not chrome

Wrap only the part the client should toggle. Keep shared chrome — the
`<section>`, the centering container, the `id` anchor — *outside* the Block.

```tsx
// ✅ correct: section + container stay outside; Block wraps swappable content
<section id="pricing" className="py-20">
  <div className="mx-auto max-w-5xl px-6">
    <Block name="Pricing">
      <Variant name="main">{/* original content */}</Variant>
      <Variant name="value-led">{/* alternative */}</Variant>
    </Block>
  </div>
</section>
```

Do NOT wrap the outer `<section>` itself, or you'll duplicate the chrome across
variants.

## Workflow

### 1. Locate the target
Identify the section from the user's prose and/or the open/selected file. Read the
file. Figure out which JSX is the "swappable content" vs the shared chrome.

### 2. Wrap (skip if already a Block)
- If the content isn't inside a `<Block>`, wrap it: move the current markup into
  `<Variant name="main">` inside a `<Block name="...">`, placed inside the chrome
  per the rule above.
- Ensure `import { Block, Variant } from "@whichly/react"` exists; add it if
  missing. Do not add `"use client"`.
- If it's already wrapped, detect the existing variants (especially `main`) and
  go straight to step 3 — append new variants, never touch existing ones.

### 3. Interview FIRST (always)
Before generating anything, propose the alternatives and get sign-off:
- Default to **2 alternatives** (3 total incl. `main`); honor an explicit count if
  the user gave one ("give me 4").
- For each proposed alternative, state a **one-line hypothesis** and a proposed
  **kebab-case name**. Make them genuinely distinct angles (e.g. benefit-led vs
  social-proof vs urgency) — not reworded copies.
- Ask the user to confirm, edit the angles/names, or add direction.

### 4. Generate
Produce one `<Variant name="kebab">` per agreed angle. Choose the source per angle:

- **From scratch** (default): distinct layout + copy. Match the file's existing
  component imports, Tailwind class conventions, spacing, and formatting. Reuse
  the same building-block components/props the `main` variant uses where it makes
  sense (e.g. local `Eyebrow`, shared `Button`/`Badge`).

- **From a shadcn registry** — when the prompt names a registry handle (e.g.
  "2 variants for the FAQ block using @efferd" or `@tailark`/`@ncdai`/`@jalco`):
  1. **Delegate to the `shadcn` skill** to add the requested block(s) into the app
     (it respects `apps/web/components.json` registries + aliases). Do not call a
     shadcn MCP — none is configured; do not hand-write the registry's CLI either.
  2. On success, compose a `<Variant>` that renders the added block, adapting it
     to the section's real content/props.
  3. **If the `shadcn` skill reports the registry isn't configured (e.g. the
     example `@react-bits` is not in `components.json`) or a named block can't be
     resolved → STOP.** Report exactly what's missing and ask how to proceed:
     generate from scratch instead, add the registry to `components.json`, try a
     different block name, or skip that variant. Never silently fall back.

Registry-sourced and from-scratch angles can be mixed in one run.

### 5. Apply & report
- Edit the file in place (the user reviews via `git diff`).
- Report the final variant names, in order, so the user knows exactly what the
  client will see in the picker stepper for that block.

## Guardrails
- Keep generated JSX type-safe and Biome-clean (match the repo's formatting).
- Never wrap variant content in an extra layout box (relies on `display:
  contents`).
- Don't invent components or props that don't exist in the file or its imports —
  reuse what's there, or import real components.
- Don't add `"use client"` to a server component just to use Block/Variant.
- Keep the shared section chrome outside the `<Block>`.

## Examples of good interview output

> Pricing block — I'll keep your current layout as `main` and add 2 alternatives:
> 1. **`value-led`** — leads with outcome/ROI before the price; reorders so the
>    benefit headline sits above the tiers.
> 2. **`single-cta`** — collapses to one recommended plan with a prominent CTA to
>    reduce choice paralysis.
>
> Want different angles, names, or a different count before I write them?
