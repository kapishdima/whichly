import { Button } from "@/components/ui/button";
import { Block, Variant } from "@whichly/react";
import { ArrowRight, Github, Sparkles } from "lucide-react";
import Link from "next/link";

const GITHUB_URL = "https://github.com/kapishdima/whichly";
const INSTALL = "npm i @whichly/react";

function InstallPill() {
  return (
    <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 font-mono text-sm">
      <span className="text-muted-foreground">$</span>
      <span>{INSTALL}</span>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-muted-foreground">
      <Sparkles className="size-3.5 text-sky-400" />
      {children}
    </span>
  );
}

const codeSnippet = `import { Block, Variant } from "@whichly/react";

<Block name="Hero">
  <Variant name="bold">
    <h1>Build a few versions. Let the client pick.</h1>
  </Variant>
  <Variant name="quiet">
    <h1>Which version does the client actually want?</h1>
  </Variant>
</Block>`;

export function HeroSection() {
  return (
    <section id="top" className="px-6 pt-36 pb-20 md:pt-44 md:pb-28">
      <div className="mx-auto max-w-5xl">
        <Block name="Hero">
          {/* Variant A — direct */}
          <Variant name="direct">
            <div className="mx-auto max-w-3xl text-center">
              <Badge>Open-source variant picker for React</Badge>
              <h1 className="mt-6 text-balance text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
                Build a few versions.{" "}
                <span className="bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent">
                  Let the client pick.
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                You write variants of a block right in your code, deploy to staging, and switch
                between them live on the real site. The client clicks through and tells you which
                one works. No screenshots, no Figma comments to dig through.
              </p>
              <div className="mt-10 flex flex-col items-center gap-4">
                <InstallPill />
              </div>
            </div>
          </Variant>

          {/* Variant B — client's pain (split layout) */}
          <Variant name="pain">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="text-center lg:text-left">
                <div className="flex justify-center lg:justify-start">
                  <Badge>Stop the Figma ping-pong</Badge>
                </div>
                <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  Which version does the client{" "}
                  <span className="bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent">
                    actually want?
                  </span>
                </h1>
                <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground lg:mx-0">
                  Stop guessing. Drop two or three versions of a block into your code and let the
                  client flip between them on the live site until they land on the one.
                </p>
                <div className="mt-8 flex flex-col items-center gap-4 lg:items-start">
                  <InstallPill />
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-2 shadow-2xl shadow-black/40">
                <div className="rounded-xl border border-white/10 bg-background">
                  <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
                    <span className="size-3 rounded-full bg-red-400/70" />
                    <span className="size-3 rounded-full bg-yellow-400/70" />
                    <span className="size-3 rounded-full bg-green-400/70" />
                    <span className="ml-3 font-mono text-xs text-muted-foreground">
                      staging.yoursite.com/?vp=Hero:pain
                    </span>
                  </div>
                  <div className="space-y-4 p-6">
                    {["Bold and punchy", "Calm and quiet", "Straight to the point"].map(
                      (label, i) => (
                        <div
                          key={label}
                          className={
                            i === 0
                              ? "rounded-lg border border-sky-400/40 bg-sky-400/10 px-4 py-3 text-sm"
                              : "rounded-lg border border-white/10 px-4 py-3 text-sm text-muted-foreground"
                          }
                        >
                          <span className="font-mono text-xs text-muted-foreground">
                            Variant {i + 1}
                          </span>
                          <p className="mt-1 font-medium text-foreground">{label}</p>
                        </div>
                      ),
                    )}
                    <p className="text-center text-xs text-muted-foreground">
                      ← client toggles, you watch the choice land
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Variant>

          {/* Variant C — the difference (centered + code) */}
          <Variant name="difference">
            <div className="mx-auto max-w-3xl text-center">
              <Badge>Not a mockup. The real site.</Badge>
              <h1 className="mt-6 text-balance text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
                See every version on the real site,{" "}
                <span className="bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent">
                  not a mockup.
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                Build a few takes on a block, ship them to staging, and switch between them live.
                Your client picks the winner in the actual layout, on the actual site.
              </p>
              <div className="mt-10 flex justify-center">
                <InstallPill />
              </div>
              <pre className="mt-10 overflow-x-auto rounded-xl border border-white/10 bg-white/[0.03] p-6 text-left text-sm leading-relaxed">
                <code>{codeSnippet}</code>
              </pre>
            </div>
          </Variant>
        </Block>
      </div>
    </section>
  );
}
