# @whichly/astro

Astro integration and components for Whichly variant previews.

Use Whichly in Astro marketing pages to preview alternate versions of the same page or section. Variants may contain plain Astro markup, Astro components, or hydrated islands such as React components.

## Install

```sh
npm i @whichly/astro
# or
pnpm add @whichly/astro
```

## Configure

```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import whichly from "@whichly/astro";

export default defineConfig({
  integrations: [whichly()],
});
```

The integration accepts optional runtime settings:

```js
whichly({
  floating: true,
  param: "vp",
});
```

`WhichlyBlock.astro` also boots the runtime once per page when a block is present, so the picker works even if an Astro setup does not include the injected integration script in development.

## Use

```astro
---
import WhichlyBlock from "@whichly/astro/components/WhichlyBlock.astro";
import WhichlyVariant from "@whichly/astro/components/WhichlyVariant.astro";
import ReactHero from "../components/ReactHero.tsx";
import AstroHero from "../components/AstroHero.astro";
---

<WhichlyBlock name="hero">
  <WhichlyVariant name="astro">
    <AstroHero />
  </WhichlyVariant>

  <WhichlyVariant name="react">
    <ReactHero client:load />
  </WhichlyVariant>
</WhichlyBlock>
```

The first variant is shown by default. Selecting another variant updates the URL, for example:

```txt
?vp=hero:react
```

This makes preview links shareable.

## Important layout rule

Place `WhichlyBlock` / `WhichlyVariant` inside the document body. Do not wrap a component that emits a full `<html>` document or an Astro layout component that owns `<html>` / `<body>`.

Good:

```astro
<BaseLayout>
  <WhichlyBlock name="homepage">
    <WhichlyVariant name="current">
      <HomePageContent />
    </WhichlyVariant>
    <WhichlyVariant name="test">
      <h1>Hello world</h1>
    </WhichlyVariant>
  </WhichlyBlock>
</BaseLayout>
```

Avoid:

```astro
<WhichlyBlock name="homepage">
  <WhichlyVariant name="current">
    <FullPageWithHtmlAndBody />
  </WhichlyVariant>
</WhichlyBlock>
```

## Astro islands

Astro islands inside inactive variants may still hydrate depending on their `client:*` directive. This is intentional for the initial render-all implementation and matches the React package model.
