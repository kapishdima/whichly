"use client";

import { ChevronLeft, ChevronRight, Minimize2, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Pipette } from "./ui/icons/pipette";

export interface PickerProps {
  blocks: Map<string, string[]>;
  state: Record<string, string>;
  onSelect: (block: string, variant: string) => void;
  onReset: (block: string) => void;
}

function wrap(list: string[], current: string, dir: 1 | -1): string {
  const len = list.length;
  if (len === 0) return current;
  const idx = list.indexOf(current);
  const start = idx === -1 ? 0 : idx;
  return list[(start + dir + len) % len] ?? current;
}

interface StepperProps {
  block: string;
  variants: string[];
  current: string;
  onSelect: (block: string, variant: string) => void;
  onReset: (block: string) => void;
}

function Stepper({ block, variants, current, onSelect, onReset }: StepperProps) {
  return (
    <div className="relative inline-flex shrink-0 items-center gap-1 rounded-full border border-border/50 bg-secondary py-1 pr-1.5 pl-3">
      <div
        className="max-w-24 overflow-hidden pr-1.5 text-xs text-ellipsis whitespace-nowrap text-muted-foreground"
        title={block}
      >
        {block}
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={`Previous ${block} variant`}
        onClick={() => onSelect(block, wrap(variants, current, -1))}
      >
        <ChevronLeft className="size-3.5" />
      </Button>
      <div
        className="min-w-20 max-w-40 overflow-hidden px-0.5 text-center text-[0.8125rem] font-medium text-ellipsis whitespace-nowrap text-foreground"
        title={current}
        aria-live="polite"
      >
        {current}
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={`Next ${block} variant`}
        onClick={() => onSelect(block, wrap(variants, current, 1))}
      >
        <ChevronRight className="size-3.5" />
      </Button>
      <Button
        variant="destructive"
        size="icon-sm"
        aria-label={`Reset ${block} variant`}
        className="rounded-full"
        onClick={() => onReset(block)}
      >
        <RotateCcw className="size-3" />
      </Button>
    </div>
  );
}

export function Picker({ blocks, state, onSelect, onReset }: PickerProps) {
  const [collapsed, setCollapsed] = useState(false);

  if (blocks.size === 0) return null;

  if (collapsed) {
    return (
      <Button
        variant="secondary"
        size="icon-xl"
        aria-label="Expand Optio picker"
        onClick={() => setCollapsed(false)}
        className="fixed bottom-[5vh] right-4 z-9999 rounded-full pointer-events-auto"
      >
        <Pipette className="size-6" />
      </Button>
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-[5vh] z-9999 flex justify-center px-4 pointer-events-none max-sm:bottom-[max(12px,env(safe-area-inset-bottom))] max-sm:px-2">
      <div
        role="toolbar"
        aria-label="Optio variant picker"
        className="optio-dock-anim pointer-events-auto flex min-w-0 max-w-full items-center gap-3.5 rounded-full bg-card px-3 py-2.5 shadow-[0_16px_48px_rgba(0,0,0,0.45)] ring-1 ring-white/10 sm:min-w-160 max-sm:gap-2 max-sm:p-2"
      >
        <div className="inline-flex shrink-0 items-center gap-2.5 pl-0.5 max-sm:gap-0 max-sm:pl-0">
          <Pipette className="size-6 shrink-0 text-foreground" />
          <div className="text-sm font-semibold text-foreground max-sm:hidden">optio</div>
        </div>
        <div className="scrollbar-none flex items-center gap-2.5 flex-1 min-w-0 overflow-x-auto py-0.5">
          {Array.from(blocks).map(([block, variants]) => (
            <Stepper
              key={block}
              block={block}
              variants={variants}
              current={state[block] ?? variants[0] ?? ""}
              onSelect={onSelect}
              onReset={onReset}
            />
          ))}
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Minimize picker"
          className="shrink-0"
          onClick={() => setCollapsed(true)}
        >
          <Minimize2 className="size-4" />
        </Button>
      </div>
    </div>
  );
}
