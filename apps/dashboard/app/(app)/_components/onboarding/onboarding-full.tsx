"use client";

import { ColorPickerIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@optio/ui/components/button";
import { Card, CardContent } from "@optio/ui/components/card";
import { cn } from "@optio/ui/lib/utils";
import { ArrowRightIcon, CheckIcon } from "lucide-react";
import Link from "next/link";
import { CreateProject } from "../create-project";
import {
  type OnboardingState,
  type OnboardingStep,
  type StepState,
  getOnboardingProgress,
  getOnboardingSteps,
} from "./steps";

export function OnboardingFull(props: OnboardingState) {
  const steps = getOnboardingSteps(props);
  const { completed, total, percent } = getOnboardingProgress(steps);

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-10">
      <header className="flex flex-col items-start gap-5">
        <span
          aria-hidden="true"
          className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"
        >
          <HugeiconsIcon icon={ColorPickerIcon} className="size-6!" strokeWidth={2} />
        </span>
        <div className="flex flex-col gap-2">
          <h1 className="max-w-[24ch] text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Welcome to Optio
          </h1>
          <p className="max-w-[60ch] text-pretty text-base text-muted-foreground sm:text-lg">
            Three steps to your first client review — spin up a project, drop the snippet into
            staging, share the link.
          </p>
        </div>
        <div className="flex w-full max-w-md items-center gap-3 pt-1">
          <div
            aria-hidden="true"
            className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-muted"
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-primary transition-[width] duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span
            aria-label={`${completed} of ${total} steps complete`}
            className="shrink-0 text-sm font-medium tabular-nums text-muted-foreground"
          >
            {completed}/{total}
          </span>
        </div>
      </header>

      <ol role="list" className="flex flex-col gap-3">
        {steps.map((step, idx) => (
          <li key={step.id}>
            <StepCard step={step} index={idx} />
          </li>
        ))}
      </ol>
    </section>
  );
}

function StepCard({ step, index }: { step: OnboardingStep; index: number }) {
  const isLocked = step.state === "locked";
  const isActive = step.state === "active";
  return (
    <Card
      className={cn(
        "gap-0 py-0 transition-colors",
        isActive && "border-primary/40 ring-2 ring-primary/20",
        isLocked && "opacity-70",
      )}
    >
      <CardContent className="flex flex-col items-start gap-4 p-5 sm:flex-row sm:items-center sm:gap-5 sm:p-6">
        <StatusIndicator state={step.state} index={index} />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h3
            className={cn(
              "text-pretty text-base font-medium",
              step.state === "complete" && "text-muted-foreground line-through",
              isLocked && "text-muted-foreground",
            )}
          >
            {step.title}
          </h3>
          <p className="max-w-[60ch] text-pretty text-sm text-muted-foreground">
            {step.description}
          </p>
        </div>
        <StepCta step={step} />
      </CardContent>
    </Card>
  );
}

function StepCta({ step }: { step: OnboardingStep }) {
  if (!step.cta || step.state !== "active") return null;
  if (step.cta.triggersCreateProject) {
    return (
      <CreateProject
        trigger={
          <Button>
            {step.cta.label}
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        }
      />
    );
  }
  if (step.cta.href) {
    return (
      <Button asChild variant="outline">
        <Link href={step.cta.href}>
          {step.cta.label}
          <ArrowRightIcon data-icon="inline-end" />
        </Link>
      </Button>
    );
  }
  return null;
}

function StatusIndicator({ state, index }: { state: StepState; index: number }) {
  if (state === "complete") {
    return (
      <div
        aria-label="Completed"
        className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground"
      >
        <CheckIcon className="size-4" />
      </div>
    );
  }
  if (state === "active") {
    return (
      <div
        aria-label="Current step"
        className="grid size-9 shrink-0 place-items-center rounded-full border-2 border-primary bg-background text-sm font-semibold tabular-nums text-primary"
      >
        {index + 1}
      </div>
    );
  }
  return (
    <div
      aria-label="Upcoming step"
      className="grid size-9 shrink-0 place-items-center rounded-full border border-border bg-background text-sm tabular-nums text-muted-foreground"
    >
      {index + 1}
    </div>
  );
}
