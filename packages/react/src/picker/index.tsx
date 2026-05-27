"use client";

import { ChevronLeft, ChevronRight, ChevronUp, Minimize2, Pipette, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

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
    <div className="relative inline-flex items-center gap-1 pl-3 pr-1.5 py-1 bg-[#262626] border border-[#2d2d2d] rounded-[10px] shrink-0 hover:border-white/15 transition-colors">
      <span
        className="text-white/50 text-xs tracking-[0.01em] pr-1.5 max-w-[96px] overflow-hidden text-ellipsis whitespace-nowrap"
        title={block}
      >
        {block}
      </span>
      <Button
        variant="arrow"
        size="sm"
        aria-label={`Previous ${block} variant`}
        onClick={() => onSelect(block, wrap(variants, current, -1))}
      >
        <ChevronLeft className="size-3.5" />
      </Button>
      <span
        className="text-white text-[13px] font-medium min-w-[80px] max-w-[160px] text-center overflow-hidden text-ellipsis whitespace-nowrap px-0.5"
        title={current}
      >
        {current}
      </span>
      <Button
        variant="arrow"
        size="sm"
        aria-label={`Next ${block} variant`}
        onClick={() => onSelect(block, wrap(variants, current, 1))}
      >
        <ChevronRight className="size-3.5" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="arrow" size="sm" aria-label={`All ${block} variants`}>
            <ChevronUp className="size-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="top" sideOffset={8}>
          {variants.map((v) => (
            <DropdownMenuItem
              key={v}
              selected={v === current}
              onSelect={() => onSelect(block, v)}
            >
              {v}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        variant="danger"
        size="sm"
        aria-label={`Reset ${block} variant`}
        className="ml-1"
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
      <button
        type="button"
        aria-label="Expand Optio picker"
        onClick={() => setCollapsed(false)}
        className="optio-chip-anim pointer-events-auto fixed right-[max(16px,5vw)] bottom-[5vh] w-14 h-14 rounded-[14px] bg-[#1a1a1a] border border-[#2d2d2d] text-white inline-flex items-center justify-center shadow-[0_18px_48px_rgba(0,0,0,0.45)] hover:-translate-y-0.5 transition-transform cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-sky-500"
      >
        <Pipette className="size-[22px]" />
      </button>
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-[5vh] flex justify-center px-4 pointer-events-none max-sm:bottom-[max(12px,env(safe-area-inset-bottom))] max-sm:px-2">
      <div className="optio-dock-anim pointer-events-auto flex items-center gap-3.5 px-3 py-2.5 bg-[#1a1a1a] border border-[#2d2d2d] rounded-[14px] shadow-[0_16px_48px_rgba(0,0,0,0.45)] max-w-full min-w-0 sm:min-w-[640px] max-sm:gap-2 max-sm:p-2">
        <div className="inline-flex items-center gap-2.5 shrink-0 pl-0.5 max-sm:pl-0 max-sm:gap-0">
          <span className="w-[30px] h-[30px] rounded-lg bg-gradient-to-br from-sky-500 to-violet-600 inline-flex items-center justify-center text-white">
            <Pipette className="size-4" />
          </span>
          <span className="font-semibold text-[15px] tracking-[0.02em] text-white max-sm:hidden">
            optio
          </span>
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
        <div className="inline-flex items-center gap-1.5 shrink-0">
          <Button
            variant="ghost"
            size="chip"
            aria-label="Minimize picker"
            onClick={() => setCollapsed(true)}
          >
            <Minimize2 className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
