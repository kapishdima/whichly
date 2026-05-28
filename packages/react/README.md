# @whichly/react

Live variant picker for React. Wrap blocks in `<Block>` / `<Variant>`, share a staging link, and let clients toggle between variants live on the real page. Variant state is encoded in the URL (`?vp=block:variant,...`), so links are shareable.

No backend, no dashboard, no auth — just one React component tree. The picker mounts into a Shadow DOM, so its styles never leak in or out of the host page.

## Install

```sh
npm i @whichly/react
# or
pnpm add @whichly/react
```

React 18 or 19 is required (declared as a peer dependency).

## Usage

Wrap your app (or any subtree) in `WhichlyProvider`, then wrap each swappable region in a named `Block` containing one or more named `Variant`s. A floating picker appears so you can switch the active variant.

```tsx
import { WhichlyProvider, Block, Variant } from "@whichly/react";

export default function Page() {
  return (
    <WhichlyProvider>
      <Block name="hero">
        <Variant name="bold">
          <h1>Ship faster.</h1>
        </Variant>
        <Variant name="friendly">
          <h1>Let's build something great together.</h1>
        </Variant>
      </Block>
    </WhichlyProvider>
  );
}
```

The first `Variant` is active by default. Selecting another in the picker updates the URL (e.g. `?vp=hero:friendly`), so the exact view can be shared with a link.

`Block` and `Variant` are also available under a namespace, which can read nicer in larger trees:

```tsx
import { Whichly } from "@whichly/react";

<Whichly.Block name="hero">
  <Whichly.Variant name="bold">{/* ... */}</Whichly.Variant>
</Whichly.Block>;
```

### Preselecting variants

Pass `initialState` to `WhichlyProvider` to choose which variant is active before any URL is applied (the URL still takes precedence when present):

```tsx
<WhichlyProvider initialState={{ hero: "friendly" }}>{/* ... */}</WhichlyProvider>
```

## Next.js / RSC

`WhichlyProvider`, `Block`, and `Variant` are client components (`"use client"`). Server Components can import and render `Block` / `Variant` directly. The namespaced `Whichly` object only works from client components.

## License

MIT © kapishdima

See the [project repository](https://github.com/kapishdima/whichly) for more.
