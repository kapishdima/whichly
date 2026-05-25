import { useState } from "preact/hooks";
import styles from "./picker.css?inline";
import type { BlocksMap, State, VariantName } from "./types";

export interface PickerProps {
  blocks: BlocksMap;
  state: State;
  onSelect: (block: string, variant: string) => void;
  onReset: () => void;
}

const COLLAPSED_KEY = "__optio:ui:collapsed";

function readCollapsed(): boolean {
  try {
    return localStorage.getItem(COLLAPSED_KEY) === "1";
  } catch {
    return false;
  }
}

function writeCollapsed(value: boolean) {
  try {
    localStorage.setItem(COLLAPSED_KEY, value ? "1" : "0");
  } catch {
    // ignore
  }
}

function wrap(list: VariantName[], current: VariantName, dir: 1 | -1): VariantName {
  const len = list.length;
  if (len === 0) return current;
  const idx = list.indexOf(current);
  const start = idx === -1 ? 0 : idx;
  return list[(start + dir + len) % len] ?? current;
}

interface RowProps {
  block: string;
  variants: VariantName[];
  current: VariantName;
  onSelect: (block: string, variant: string) => void;
}

function StepperRow({ block, variants, current, onSelect }: RowProps) {
  const idx = Math.max(variants.indexOf(current), 0);
  return (
    <div class="row">
      <div class="block-name">{block}</div>
      <div class="stepper">
        <button
          class="arrow"
          type="button"
          aria-label={`Previous ${block} variant`}
          onClick={() => onSelect(block, wrap(variants, current, -1))}
        >
          ‹
        </button>
        <div class="variant-name">
          <span class="variant-label">{current}</span>
          <span class="counter">
            {idx + 1}/{variants.length}
          </span>
        </div>
        <button
          class="arrow"
          type="button"
          aria-label={`Next ${block} variant`}
          onClick={() => onSelect(block, wrap(variants, current, 1))}
        >
          ›
        </button>
      </div>
    </div>
  );
}

function MinusIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M2 5h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function Picker({ blocks, state, onSelect, onReset }: PickerProps) {
  const [collapsed, setCollapsed] = useState<boolean>(readCollapsed);

  const toggle = () => {
    setCollapsed((c) => {
      const next = !c;
      writeCollapsed(next);
      return next;
    });
  };

  const count = blocks.size;

  if (collapsed) {
    return (
      <>
        <style>{styles}</style>
        <button
          class="chip"
          type="button"
          aria-label={`Expand Optio picker (${count} block${count === 1 ? "" : "s"})`}
          onClick={toggle}
        >
          <span class="chip-dot" />
          <span class="chip-label">Optio</span>
          <span class="chip-count">{count}</span>
        </button>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div class="panel">
        <div class="header">
          <div class="title">
            <span class="title-name">Optio</span>
          </div>
          <div class="actions">
            <button class="reset" type="button" onClick={onReset}>
              Reset
            </button>
            <button class="icon-btn" type="button" aria-label="Collapse picker" onClick={toggle}>
              <MinusIcon />
            </button>
          </div>
        </div>
        {[...blocks].map(([block, variants]) => (
          <StepperRow
            key={block}
            block={block}
            variants={variants}
            current={state[block] ?? variants[0] ?? ""}
            onSelect={onSelect}
          />
        ))}
      </div>
    </>
  );
}
