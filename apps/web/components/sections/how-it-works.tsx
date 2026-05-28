import { Download, Layers, MousePointerClick } from "lucide-react";
import { InstallationCode } from "../installation-code";
import { Button } from "../ui/button";
import Link from "next/link";

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-medium text-sky-400">{eyebrow}</p>
      <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
        {title}
      </h2>
    </div>
  );
}

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="scroll-mt-24 bg-white/2 py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading
          eyebrow="How it works"
          title="From install to a clicked choice in three steps"
        />
        <div className="mt-12 grid divide-y divide-white/10 border border-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div key="Step 1" className="space-y-3 p-8">
            <div className="flex items-center gap-2">
              <Download className="size-4 text-sky-400" />
              <span className="text-xs text-muted-foreground">Step 1</span>
            </div>
            <h3 className="text-lg font-medium">Install the package</h3>
            <p className="text-pretty text-sm text-muted-foreground">
              Add Whichly to your project and wrap your app. One line to install
            </p>
            <InstallationCode />
          </div>
          <div key="Step 2" className="space-y-3 p-8">
            <div className="flex items-center gap-2">
              <Layers className="size-4 text-sky-400" />
              <span className="text-xs text-muted-foreground">Step 2</span>
            </div>
            <h3 className="text-lg font-medium">Add your variants</h3>
            <p className="text-pretty text-sm text-muted-foreground">
              Write two or three versions of a block right where it already lives in your code
            </p>
            <Button
              render={
                <Link href="/docs/blocks" className="text-sm">
                  Read the docs
                </Link>
              }
            />
          </div>
          <div key="Step 3" className="space-y-3 p-8">
            <div className="flex items-center gap-2">
              <MousePointerClick className="size-4 text-sky-400" />
              <span className="text-xs text-muted-foreground">Step 3</span>
            </div>
            <h3 className="text-lg font-medium">Switch on the site</h3>
            <p className="text-pretty text-sm text-muted-foreground">
              Deploy to staging and open the link. Flip between versions live, see each one in the
              real layout, and pick the one that works
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
