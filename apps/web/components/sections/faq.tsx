"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Block, Variant } from "@whichly/react";

const GITHUB_URL = "https://github.com/kapishdima/whichly";

// Variant A — canonical phrasing
const faqsCard = [
  {
    id: "prod",
    q: "Does this affect my production site?",
    a: "No. The picker does nothing without a token in the URL. On your live site it's inert.",
  },
  {
    id: "frameworks",
    q: "What frameworks does it work with?",
    a: "Any of them. The package is built for React, and the underlying mechanism works anywhere.",
  },
  {
    id: "done",
    q: "What happens when I'm done choosing?",
    a: "You delete the versions the client didn't pick. The session ends naturally — once a block has only one version left, there's nothing to switch. Cleanup is on you, which keeps your code honest.",
  },
  {
    id: "client-install",
    q: "Will the client need to install anything?",
    a: "No. You send them a staging link, they open it and start clicking.",
  },
];

// Variant B — rephrased
const faqsMuted = [
  {
    id: "prod",
    q: "Will it touch my production build?",
    a: "Never. Without a token in the URL the picker is dead code — on the live site nothing mounts and nothing runs.",
  },
  {
    id: "frameworks",
    q: "Does it only work with React?",
    a: "It ships as a React package, but the mechanism underneath is framework-agnostic. If you're on React you're covered today.",
  },
  {
    id: "done",
    q: "How do I wrap things up?",
    a: "Delete the variants nobody chose. When a block is down to one version there's nothing left to toggle, so the session just ends. You stay in control of the cleanup.",
  },
  {
    id: "client-install",
    q: "Does the client install anything?",
    a: "Nope. They get a staging link, open it, and start clicking. Zero setup on their end.",
  },
];

// Variant C — short phrasing
const faqsList = [
  {
    id: "prod",
    q: "Is production safe?",
    a: "Yes. No token, no picker. It can't change anything your users see.",
  },
  {
    id: "frameworks",
    q: "Which stacks are supported?",
    a: "React out of the box; the core idea works in any framework.",
  },
  {
    id: "done",
    q: "What about after the decision?",
    a: "Remove the losing variants. One version left means nothing to switch — the flow closes itself.",
  },
  {
    id: "client-install",
    q: "Any client-side setup?",
    a: "None. A link is all they need.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-24 px-6 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <Block name="FAQ">
          {/* Variant A — accordion in a card */}
          <Variant name="card">
            <div className="mx-auto max-w-xl text-center">
              <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
                Frequently asked questions
              </h2>
              <p className="mt-4 text-balance text-muted-foreground">
                The short version: it's inert in production, it's just your React code, and the
                client never installs a thing.
              </p>
            </div>
            <div className="mx-auto mt-12 max-w-xl">
              <Accordion multiple={false} className="border-white/10 bg-white/[0.03] px-2">
                {faqsCard.map((item) => (
                  <AccordionItem key={item.id} value={item.id} className="border-white/10">
                    <AccordionTrigger className="text-base">{item.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      <p className="text-base">{item.a}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </Variant>

          {/* Variant B — muted accordion */}
          <Variant name="muted">
            <div className="mx-auto max-w-xl text-center">
              <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
                Questions, answered
              </h2>
              <p className="mt-4 text-balance text-muted-foreground">
                Everything clients and teammates tend to ask before they share that first staging
                link.
              </p>
            </div>
            <div className="mx-auto mt-12 max-w-xl">
              <Accordion multiple={false} className="gap-1 border-transparent bg-white/[0.04] p-1">
                {faqsMuted.map((item) => (
                  <AccordionItem
                    key={item.id}
                    value={item.id}
                    className="rounded-xl border-none px-3 data-open:bg-white/[0.04]"
                  >
                    <AccordionTrigger className="text-base">{item.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      <p className="text-base">{item.a}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </Variant>

          {/* Variant C — two-column list */}
          <Variant name="list">
            <div className="grid gap-y-12 lg:grid-cols-[1fr_auto] lg:gap-x-16">
              <div className="text-center lg:text-left">
                <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
                  Frequently <br className="hidden lg:block" /> asked{" "}
                  <br className="hidden lg:block" />
                  questions
                </h2>
                <p className="mt-4 text-muted-foreground">
                  Still unsure?{" "}
                  <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-foreground underline underline-offset-4"
                  >
                    Open an issue.
                  </a>
                </p>
              </div>
              <div className="divide-y divide-dashed divide-white/10 sm:mx-auto sm:max-w-lg lg:mx-0">
                {faqsList.map((item, i) => (
                  <div key={item.id} className={i === 0 ? "pb-6" : "py-6"}>
                    <h3 className="font-medium">{item.q}</h3>
                    <p className="mt-3 text-muted-foreground">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </Variant>
        </Block>
      </div>
    </section>
  );
}
