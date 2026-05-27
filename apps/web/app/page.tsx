import { Block, Variant } from "@optio/react";

const installSnippet = "npm install @optio/react";

const codeSnippet = `import { OptioProvider, Block, Variant } from "@optio/react";

export default function Page() {
  return (
    <OptioProvider>
      <Block name="Hero">
        <Variant name="Bold">
          <h1>Ship faster.</h1>
        </Variant>
        <Variant name="Friendly">
          <h1>Hey, want to ship faster?</h1>
        </Variant>
      </Block>
    </OptioProvider>
  );
}`;

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <nav className="flex items-center justify-between mb-24">
        <span className="text-lg font-semibold tracking-tight">optio</span>
        <a
          href="https://github.com/kapishdima/optio"
          className="text-sm text-white/60 hover:text-white transition-colors"
        >
          GitHub →
        </a>
      </nav>

      <section className="text-center mb-32">
        <Block name="Headline">
          <Variant name="Bold">
            <h1 className="text-6xl sm:text-7xl font-bold tracking-tight leading-[1.05]">
              Show your client
              <br />
              <span className="bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent">
                every variant.
              </span>
            </h1>
          </Variant>
          <Variant name="Direct">
            <h1 className="text-6xl sm:text-7xl font-bold tracking-tight leading-[1.05]">
              Stop guessing
              <br />
              what they&apos;ll&nbsp;like.
            </h1>
          </Variant>
          <Variant name="Friendly">
            <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight leading-[1.1]">
              The fastest way to ship the version
              <br />
              your client actually wants.
            </h1>
          </Variant>
        </Block>

        <Block name="Subhead">
          <Variant name="Short">
            <p className="mt-6 text-lg text-white/60 max-w-2xl mx-auto">
              A floating picker for live React staging pages. Open source.
            </p>
          </Variant>
          <Variant name="Long">
            <p className="mt-6 text-lg text-white/60 max-w-2xl mx-auto">
              Wrap blocks in <code className="text-white">{"<Variant>"}</code>, share a
              staging link, let your client flip between options live on the real page — no Figma
              ping-pong, no rebuilds.
            </p>
          </Variant>
        </Block>

        <div className="mt-10 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 font-mono text-sm">
          <span className="text-white/40">$</span>
          <span>{installSnippet}</span>
        </div>

        <p className="mt-4 text-xs text-white/40">
          ↓ try the picker at the bottom to switch the headline above
        </p>
      </section>

      <section className="mb-32">
        <h2 className="text-2xl font-semibold mb-6">Write variants inline.</h2>
        <pre className="overflow-x-auto rounded-xl border border-white/10 bg-white/[0.03] p-6 text-sm leading-relaxed">
          <code>{codeSnippet}</code>
        </pre>
      </section>

      <section className="mb-32">
        <h2 className="text-2xl font-semibold mb-8">How it works</h2>
        <ol className="space-y-4 text-white/70">
          <li>
            <span className="text-white font-medium">1. Wrap blocks.</span> Put each block
            variation inside <code className="text-white">{"<Variant>"}</code>.
          </li>
          <li>
            <span className="text-white font-medium">2. Deploy to staging.</span> All variants
            render; only the active one is visible.
          </li>
          <li>
            <span className="text-white font-medium">3. Share the link.</span> The client toggles
            variants live on the real page.
          </li>
          <li>
            <span className="text-white font-medium">4. Read the URL.</span> Their selection is
            encoded as <code className="text-white">?vp=Hero:Bold,...</code> — shareable, no
            backend needed.
          </li>
        </ol>
      </section>

      <footer className="border-t border-white/10 pt-8 pb-4 text-sm text-white/40 flex items-center justify-between">
        <span>MIT licensed. Open source.</span>
        <a
          href="https://github.com/kapishdima/optio"
          className="hover:text-white transition-colors"
        >
          github.com/kapishdima/optio
        </a>
      </footer>
    </main>
  );
}
