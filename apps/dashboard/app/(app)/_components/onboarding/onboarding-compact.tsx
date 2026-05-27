"use client";

import { Button } from "@optio/ui/components/button";
import { Popover, PopoverContent, PopoverTrigger } from "@optio/ui/components/popover";
import { SidebarMenuItem } from "@optio/ui/components/sidebar";
import { cn } from "@optio/ui/lib/utils";
import { ArrowRightIcon, CircleCheckIcon, ListTodoIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CreateProject } from "../create-project";
import {
  type OnboardingState,
  type OnboardingStep,
  type StepState,
  getOnboardingProgress,
  getOnboardingSteps,
} from "./steps";

export function OnboardingCompact(props: OnboardingState) {
  const [open, setOpen] = useState(false);
  const steps = getOnboardingSteps(props);
  const { completed, total, percent, done } = getOnboardingProgress(steps);

  if (done) return null;

  return (
    <SidebarMenuItem>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={`Setup guide, ${completed} of ${total} steps complete`}
            className={cn(
              "flex w-full items-center gap-3 rounded-md p-2 text-left outline-none",
              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              "focus-visible:ring-2 focus-visible:ring-sidebar-ring",
              "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground",
              "group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0",
            )}
          >
            <ListTodoIcon
              className="size-4 shrink-0 text-primary group-data-[collapsible=icon]:size-4"
              aria-hidden="true"
            />
            <span className="flex min-w-0 flex-1 flex-col gap-1.5 group-data-[collapsible=icon]:hidden">
              <span className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-medium">Setup guide</span>
                <span className="shrink-0 text-xs font-medium tabular-nums text-muted-foreground">
                  {completed}/{total}
                </span>
              </span>
              <span className="relative h-1 overflow-hidden rounded-full bg-sidebar-border/70">
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 rounded-full bg-primary transition-[width] duration-500"
                  style={{ width: `${percent}%` }}
                />
              </span>
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent
          side="right"
          align="end"
          sideOffset={12}
          collisionPadding={16}
          className="w-80 overflow-hidden p-0"
        >
          <header className="flex flex-col gap-1 border-b px-4 py-3">
            <h3 className="max-w-[40ch] text-balance text-sm font-semibold">
              Get started with Optio
            </h3>
            <p className="text-pretty text-sm text-muted-foreground">
              Three steps to your first client review.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <div
                aria-hidden="true"
                className="relative h-1 flex-1 overflow-hidden rounded-full bg-muted"
              >
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-primary transition-[width] duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span
                aria-label={`${completed} of ${total} steps complete`}
                className="shrink-0 text-xs font-medium tabular-nums text-muted-foreground"
              >
                {completed}/{total}
              </span>
            </div>
          </header>
          <ol role="list" className="flex flex-col px-4 py-2">
            {steps.map((step, idx) => (
              <li
                key={step.id}
                className={cn(
                  "flex items-start gap-3 py-3",
                  idx > 0 && "border-t border-border/60",
                )}
              >
                <StatusIndicator state={step.state} index={idx} />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <h4
                    className={cn(
                      "text-sm font-medium",
                      step.state === "complete" && "text-muted-foreground line-through",
                      step.state === "locked" && "text-muted-foreground",
                    )}
                  >
                    {step.title}
                  </h4>
                  <p
                    className={cn(
                      "max-w-[42ch] text-pretty text-sm text-muted-foreground",
                      step.state === "locked" && "text-muted-foreground/70",
                    )}
                  >
                    {step.description}
                  </p>
                  <StepCta step={step} onSelect={() => setOpen(false)} />
                </div>
              </li>
            ))}
          </ol>
        </PopoverContent>
      </Popover>
    </SidebarMenuItem>
  );
}

function StepCta({ step, onSelect }: { step: OnboardingStep; onSelect: () => void }) {
  if (!step.cta) return null;
  if (step.cta.triggersCreateProject) {
    return (
      <div className="pt-2">
        <CreateProject
          trigger={
            <Button size="sm" variant="outline" onClick={onSelect}>
              {step.cta.label}
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          }
        />
      </div>
    );
  }
  if (step.cta.href) {
    return (
      <div className="pt-2">
        <Button asChild size="sm" variant="outline" onClick={onSelect}>
          <Link href={step.cta.href}>
            {step.cta.label}
            <ArrowRightIcon data-icon="inline-end" />
          </Link>
        </Button>
      </div>
    );
  }
  return null;
}

function StatusIndicator({ state, index }: { state: StepState; index: number }) {
  if (state === "complete") {
    return <CircleCheckIcon className="size-5 shrink-0 text-primary" aria-label="Completed" />;
  }
  if (state === "active") {
    return (
      <div
        aria-label="Current step"
        className="grid size-5 shrink-0 place-items-center rounded-full border-2 border-primary bg-background text-[0.625rem] font-semibold tabular-nums text-primary"
      >
        {index + 1}
      </div>
    );
  }
  return (
    <div
      aria-label="Upcoming step"
      className="grid size-5 shrink-0 place-items-center rounded-full border border-border bg-background text-[0.625rem] tabular-nums text-muted-foreground"
    >
      {index + 1}
    </div>
  );
}
