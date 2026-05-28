import { Card, CardContent } from "@/components/ui/card";
import { Block, Variant } from "@whichly/react";
import { Download, Layers, MousePointerClick } from "lucide-react";

const icons = [Download, Layers, MousePointerClick];

// Variant A — canonical phrasing
const stepsGrid = [
  {
    title: "Install the package",
    body: "Add Whichly to your project and wrap your app. One line to install, one component to set things up.",
  },
  {
    title: "Add your variants",
    body: "Write two or three versions of a block right where it already lives in your code. Same place, same components, just different takes on it.",
  },
  {
    title: "Switch on the site",
    body: "Deploy to staging and open the link. Flip between versions live, see each one in the real layout, and pick the one that works.",
  },
];

// Variant B — punchy phrasing
const stepsTimeline = [
  {
    title: "Install",
    body: "npm i @whichly/react, then wrap your app in <WhichlyProvider>. That's the whole setup.",
  },
  {
    title: "Add variants",
    body: "Drop a <Block> around the part in question and give it a couple of <Variant>s. It's just your components, twice.",
  },
  {
    title: "Switch live",
    body: "Ship to staging, share the link. The picker floats on the page and your client toggles between takes.",
  },
];

// Variant C — outcome-focused phrasing
const stepsCards = [
  {
    title: "One line to install",
    body: "Pull the package in and mount the provider once. No config, no backend, no dashboard.",
  },
  {
    title: "Versions live in code",
    body: "Each variant is real JSX in the real file. The version that gets picked is the version that ships.",
  },
  {
    title: "The client decides",
    body: "Send a staging link. They flip through every take in the actual layout and land on the winner.",
  },
];

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-medium text-sky-400">{eyebrow}</p>
      <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
        {title}
      </h2>
    </div>
  );
}

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="scroll-mt-24 px-6 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <Block name="HowItWorks">
          {/* Variant A — divider grid */}
          <Variant name="grid">
            <SectionHeading
              eyebrow="How it works"
              title="From install to a clicked choice in three steps"
            />
            <div className="mt-12 grid divide-y divide-white/10 border border-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {stepsGrid.map((step, i) => {
                const Icon = icons[i] ?? Download;
                return (
                  <div key={step.title} className="space-y-3 p-8">
                    <div className="flex items-center gap-2">
                      <Icon className="size-4 text-sky-400" />
                      <span className="font-mono text-xs text-muted-foreground">Step {i + 1}</span>
                    </div>
                    <h3 className="text-lg font-medium">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.body}</p>
                  </div>
                );
              })}
            </div>
          </Variant>

          {/* Variant B — vertical timeline */}
          <Variant name="timeline">
            <SectionHeading eyebrow="How it works" title="Three moves, all in your own code" />
            <ol className="relative mx-auto mt-12 max-w-2xl space-y-10 before:absolute before:left-5 before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-white/10">
              {stepsTimeline.map((step, i) => (
                <li key={step.title} className="relative flex gap-6">
                  <span className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-background font-semibold text-sky-400">
                    {i + 1}
                  </span>
                  <div className="pt-1">
                    <h3 className="text-lg font-medium">{step.title}</h3>
                    <p className="mt-1 font-mono text-sm text-muted-foreground">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Variant>

          {/* Variant C — cards */}
          <Variant name="cards">
            <SectionHeading
              eyebrow="How it works"
              title="No new mental model. Just your code, twice."
            />
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {stepsCards.map((step, i) => (
                <Card key={step.title} className="border-white/10">
                  <CardContent className="space-y-3">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400/20 to-violet-500/20 font-semibold text-sky-400">
                      {i + 1}
                    </span>
                    <h3 className="text-base font-medium text-foreground">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.body}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Variant>
        </Block>
      </div>
    </section>
  );
}
