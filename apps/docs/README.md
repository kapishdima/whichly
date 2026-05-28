# @whichly/docs

The documentation site for [`@whichly/react`](../../packages/react), built with
[Fumadocs](https://fumadocs.dev) (Next.js App Router + MDX).

## Develop

From the repo root:

```bash
pnpm install
pnpm --filter @whichly/docs dev
```

Then open http://localhost:3001/docs.

## Authoring content

Docs live as MDX in `content/docs/`. Sidebar order is controlled by the `meta.json` files.
The content source is wired up in `lib/source.ts` via the Fumadocs `loader()`, and the
frontmatter/`meta.json` schemas live in `source.config.ts`.

| Path | Description |
| --- | --- |
| `content/docs/` | The MDX pages and `meta.json` navigation files. |
| `app/(home)` | The landing page route group. |
| `app/docs` | The documentation layout and catch-all page. |
| `app/api/search/route.ts` | The route handler for search. |
