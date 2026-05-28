"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
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

export function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            The short version: it's inert in production, it's just your React code, and the client
            never installs a thing.
          </p>
        </div>
        <div className="mx-auto mt-12 max-w-xl">
          <Accordion className="bg-muted dark:bg-muted/50 w-full rounded-2xl p-1">
            {faqs.map((item) => (
              <div className="group" key={item.id}>
                <AccordionItem
                  value={item.id}
                  className="data-[state=open]:bg-card dark:data-[state=open]:bg-muted peer rounded-xl border-none px-7 py-1 data-[state=open]:border-none data-[state=open]:shadow-sm"
                >
                  <AccordionTrigger className="cursor-pointer text-base hover:no-underline">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-base">{item.a}</p>
                  </AccordionContent>
                </AccordionItem>
                <hr className="mx-7 border-dashed group-last:hidden peer-data-[state=open]:opacity-0" />
              </div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
