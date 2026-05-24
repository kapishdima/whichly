import styles from "./picker.css?inline";
import type { BlocksMap, State } from "./types";

export interface PickerProps {
  blocks: BlocksMap;
  state: State;
  onSelect: (block: string, variant: string) => void;
  onReset: () => void;
}

export function Picker({ blocks, state, onSelect, onReset }: PickerProps) {
  const count = blocks.size;
  return (
    <>
      <style>{styles}</style>
      <div class="panel">
        <div class="header">
          <div class="title">
            Optio · {count} block{count === 1 ? "" : "s"}
          </div>
          <button class="reset" type="button" onClick={onReset}>
            Reset
          </button>
        </div>
        {[...blocks].map(([block, variants]) => (
          <div class="row" key={block}>
            <div class="block-name">{block}</div>
            <div class="variants">
              {variants.map((variant) => (
                <button
                  key={variant}
                  class={`btn${state[block] === variant ? " active" : ""}`}
                  type="button"
                  onClick={() => onSelect(block, variant)}
                >
                  {variant}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
