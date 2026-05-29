# @whichly/core

Framework-agnostic DOM runtime for Whichly variant previews.

`@whichly/core` scans server-rendered HTML for Whichly data attributes, keeps variant state in the URL, applies the active variant to the DOM, and renders the floating picker inside a Shadow DOM.

It is intended for framework integrations such as `@whichly/astro`, but can also be used directly on any static or server-rendered page.

## Install

```sh
npm i @whichly/core
# or
pnpm add @whichly/core
```

## Markup contract

```html
<div data-whichly-block="hero">
  <div data-whichly-variant="simple">
    <h1>Simple hero</h1>
  </div>

  <div data-whichly-variant="bold">
    <h1>Bold hero</h1>
  </div>
</div>
```

The first variant is active by default. Active variants use `display: contents`; inactive variants use `display: none`.

## Runtime

```ts
import { createWhichlyRuntime } from "@whichly/core";

const runtime = createWhichlyRuntime();
```

Options:

```ts
createWhichlyRuntime({
  floating: true,
  param: "vp",
  root: document,
});
```

## URL state

Variant selections are encoded in the URL:

```txt
?vp=hero:bold,pricing:enterprise
```

## API

```ts
runtime.scan();
runtime.select("hero", "bold");
runtime.reset("hero");
runtime.subscribe(() => {
  console.log(runtime.state);
});
runtime.destroy();
```

The runtime also observes DOM mutations, so blocks added later by islands or client-rendered components are picked up automatically.
