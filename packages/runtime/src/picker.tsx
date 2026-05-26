import { useEffect, useLayoutEffect, useRef, useState } from "preact/hooks";
import styles from "./picker.css?inline";
import type { BlocksMap, State, VariantName } from "./types";

export interface ReviewItem {
  block: string;
  variant: string;
  comment: string;
}

export interface PickerProps {
  blocks: BlocksMap;
  state: State;
  onSelect: (block: string, variant: string) => void;
  onResetBlock: (block: string) => void;
  onReview?: (items: ReviewItem[]) => Promise<void> | void;
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

function PipetteIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8.95667 4.66669L4.77277 8.85062M11.3333 7.04335L9.52607 8.85062L5.59485 12.7818C4.99379 13.3829 4.69325 13.6834 4.31109 13.8418C3.92892 14 3.50391 14 2.65388 14H2V13.3462C2 12.4961 2 12.0711 2.1583 11.689C2.31659 11.3068 2.61713 11.0062 3.21819 10.4052L4.77277 8.85062M4.77277 8.85062H9.52607"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.8058 5.59246L13.88 6.66667M12.8058 5.59246L13.3803 5.01788C13.5753 4.82287 13.6729 4.72537 13.7407 4.63019C14.0865 4.14451 14.0865 3.49302 13.7407 3.00733C13.6729 2.91216 13.5753 2.81465 13.3803 2.61965C13.1853 2.42465 13.0879 2.32713 12.9927 2.25937C12.507 1.91355 11.8555 1.91355 11.3698 2.25937C11.2747 2.32713 11.1771 2.42463 10.9821 2.61965L10.4075 3.19422M9.33334 2.12001L10.4075 3.19422L12.8058 5.59246"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AngleLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M8.75 3.5C8.75 3.5 5.25001 6.07769 5.25 7C5.24999 7.92237 8.75 10.5 8.75 10.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AngleRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M5.25 10.5C5.25 10.5 8.74999 7.92231 8.75 7C8.75001 6.07763 5.25 3.5 5.25 3.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AngleTopIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M10.5 8.75C10.5 8.75 7.92231 5.25001 7 5.25C6.07763 5.24999 3.5 8.75 3.5 8.75"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RedoIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M10.5 6C10.5 8.4853 8.4853 10.5 6 10.5C3.51472 10.5 1.5 8.4853 1.5 6C1.5 3.51472 3.51472 1.5 6 1.5C7.60365 1.5 9.01135 2.33882 9.8083 3.60163M10.3533 1.50038L10.2672 2.52726C10.2052 3.26692 10.1742 3.63674 9.9332 3.84457C9.6922 4.05239 9.33665 4.01593 8.6255 3.94298L7.6033 3.83812"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BugIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2.008 4.39832C1.92805 5.10452 2.43889 6.79676 3.91791 6.83669"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M12.1927 6.79665C12.9123 6.83665 13.9915 5.99719 13.9915 4.39825"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M13.3917 13.992C13.4317 13.0726 12.8321 11.6495 11.6729 11.6095"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M2.60092 13.9921C2.56006 13.0666 3.17293 11.634 4.35783 11.5937"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M2.00818 9.19507H3.47838"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M14 9.19507H12.5521"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M7.99547 9.19506V7.2364M10.9935 1.99988L9.79427 3.19908M4.99744 1.99988L6.19664 3.19908"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M4.63745 5.74139C5.71673 6.51688 8.39497 7.63613 11.313 5.78936"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M11.2173 5.11782C8.83483 1.80002 5.79687 3.39896 4.71759 5.21375C4.01391 6.39697 2.91878 9.25909 4.9974 12.377C7.23589 15.1112 9.87416 13.872 10.9534 12.433C11.9928 11.1938 13.0161 7.99589 11.2173 5.11782Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

function QuestionIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M14.3333 8.00002C14.3333 11.4978 11.4978 14.3334 7.99996 14.3334C6.91456 14.3334 5.89289 14.0603 4.99996 13.5792C3.75447 12.908 2.91637 13.532 2.17724 13.6439C2.06512 13.6609 1.95345 13.6202 1.87327 13.54C1.75157 13.4183 1.7284 13.2301 1.79563 13.0716C2.08573 12.3879 2.35209 11.0922 1.9889 10C1.77983 9.37135 1.66663 8.69889 1.66663 8.00002C1.66663 4.50221 4.50215 1.66669 7.99996 1.66669C11.4978 1.66669 14.3333 4.50221 14.3333 8.00002Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.33337 6.33335C6.33337 5.41288 7.07957 4.66669 8.00004 4.66669C8.92051 4.66669 9.66671 5.41288 9.66671 6.33335C9.66671 6.90462 9.37931 7.40875 8.94117 7.70909C8.48557 8.02129 8.00004 8.44775 8.00004 9.00002"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.08337 11.1667H8.00004M8.16671 11.1667C8.16671 11.2587 8.09211 11.3333 8.00004 11.3333C7.90797 11.3333 7.83337 11.2587 7.83337 11.1667C7.83337 11.0746 7.90797 11 8.00004 11C8.09211 11 8.16671 11.0746 8.16671 11.1667Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MinimizeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.5023 10.7365C7.34671 10.7485 10.1432 11.3294 10.7361 10.7365C11.329 10.1436 10.7481 7.34708 10.7361 6.50267M13.2685 17.5027C13.2565 16.6583 12.6756 13.8618 13.2685 13.2689C13.8614 12.676 16.6579 13.2569 17.5023 13.2689M20.9991 21.001L13.6102 13.6188M10.3691 10.3763L2.99998 2.99902"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M3.5 5.25C3.5 5.25 6.07769 8.74999 7 8.75C7.92237 8.75001 10.5 5.25 10.5 5.25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M5.5 8.5L7.25 10L10.5 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 5v3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="11" r="0.75" fill="currentColor" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M3 7.5L5.5 10L11 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface StepperProps {
  block: string;
  variants: VariantName[];
  current: VariantName;
  dropdownOpen: boolean;
  onSelect: (block: string, variant: string) => void;
  onResetBlock: (block: string) => void;
  onToggleDropdown: (block: string | null) => void;
  registerRef: (el: HTMLDivElement | null) => void;
}

function Stepper({
  block,
  variants,
  current,
  dropdownOpen,
  onSelect,
  onResetBlock,
  onToggleDropdown,
  registerRef,
}: StepperProps) {
  return (
    <div class={`stepper${dropdownOpen ? " open" : ""}`} ref={registerRef}>
      <span class="stepper-block" title={block}>
        {block}
      </span>
      <button
        class="stepper-arrow"
        type="button"
        aria-label={`Previous ${block} variant`}
        onClick={() => onSelect(block, wrap(variants, current, -1))}
      >
        <AngleLeftIcon />
      </button>
      <span class="stepper-variant" title={current}>
        {current}
      </span>
      <button
        class="stepper-arrow"
        type="button"
        aria-label={`Next ${block} variant`}
        onClick={() => onSelect(block, wrap(variants, current, 1))}
      >
        <AngleRightIcon />
      </button>
      <button
        class="stepper-arrow"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={dropdownOpen}
        aria-label={`All ${block} variants`}
        onClick={() => onToggleDropdown(dropdownOpen ? null : block)}
      >
        <AngleTopIcon />
      </button>
      <button
        class="stepper-reset"
        type="button"
        aria-label={`Reset ${block} variant`}
        onClick={() => onResetBlock(block)}
      >
        <RedoIcon />
      </button>
    </div>
  );
}

interface AccordionItemProps {
  block: string;
  current: VariantName;
  comment: string;
  open: boolean;
  onToggle: () => void;
  onCommentChange: (value: string) => void;
}

function AccordionItem({
  block,
  current,
  comment,
  open,
  onToggle,
  onCommentChange,
}: AccordionItemProps) {
  return (
    <div class={`accordion-item${open ? " open" : ""}`}>
      <button class="accordion-header" type="button" aria-expanded={open} onClick={onToggle}>
        <span class="accordion-block">{block}</span>
        <span class="accordion-selected">
          Selected: <span class="accordion-variant">{current}</span>
        </span>
        <span class="accordion-caret">
          <ChevronDownIcon />
        </span>
      </button>
      {open && (
        <div class="accordion-body">
          <label class="accordion-label" for={`opt-cmt-${block}`}>
            Your comment
          </label>
          <textarea
            id={`opt-cmt-${block}`}
            class="accordion-textarea"
            value={comment}
            placeholder="Add a note for the team..."
            onInput={(e) => onCommentChange((e.currentTarget as HTMLTextAreaElement).value)}
          />
        </div>
      )}
    </div>
  );
}

export function Picker({ blocks, state, onSelect, onResetBlock, onReview }: PickerProps) {
  const [collapsed, setCollapsed] = useState<boolean>(readCollapsed);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [dropdownGeom, setDropdownGeom] = useState<{
    left: number;
    bottom: number;
    width: number;
  } | null>(null);

  const dockRef = useRef<HTMLDivElement>(null);
  const steppersRef = useRef<HTMLDivElement>(null);
  const stepperRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const firstBlock = blocks.size > 0 ? (blocks.keys().next().value ?? null) : null;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (openDropdown) {
        setOpenDropdown(null);
        return;
      }
      if (reviewOpen) setReviewOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [openDropdown, reviewOpen]);

  useLayoutEffect(() => {
    if (!openDropdown) {
      setDropdownGeom(null);
      return;
    }
    const compute = () => {
      const stepper = stepperRefs.current.get(openDropdown);
      const dock = dockRef.current;
      if (!stepper || !dock) return;
      const sRect = stepper.getBoundingClientRect();
      const dRect = dock.getBoundingClientRect();
      setDropdownGeom({
        left: sRect.left - dRect.left,
        bottom: dRect.bottom - sRect.top + 6,
        width: sRect.width,
      });
    };
    compute();
    const steppers = steppersRef.current;
    steppers?.addEventListener("scroll", compute);
    window.addEventListener("resize", compute);
    return () => {
      steppers?.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, [openDropdown]);

  useEffect(() => {
    if (!openDropdown) return;
    const dock = dockRef.current;
    if (!dock) return;
    const root = dock.getRootNode() as Document | ShadowRoot;
    const handler = (e: Event) => {
      const path = (e as MouseEvent).composedPath();
      const stepper = stepperRefs.current.get(openDropdown);
      if (stepper && path.includes(stepper)) return;
      const dd = dock.querySelector(".variant-dropdown");
      if (dd && path.includes(dd)) return;
      setOpenDropdown(null);
    };
    root.addEventListener("mousedown", handler, true);
    return () => root.removeEventListener("mousedown", handler, true);
  }, [openDropdown]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      const next = !c;
      writeCollapsed(next);
      return next;
    });
    setOpenDropdown(null);
    setReviewOpen(false);
  };

  const handleOpenReview = () => {
    setOpenDropdown(null);
    setReviewOpen(true);
    setOpenAccordion(firstBlock);
  };

  const handleCancelReview = () => {
    setReviewOpen(false);
  };

  const handleSubmitReview = async () => {
    if (submitting) return;
    setSubmitting(true);
    const payload: ReviewItem[] = [...blocks.keys()].map((block) => ({
      block,
      variant: state[block] ?? blocks.get(block)?.[0] ?? "",
      comment: comments[block] ?? "",
    }));
    try {
      if (onReview) await onReview(payload);
      setToast({ kind: "success", text: "Review submitted" });
      setReviewOpen(false);
    } catch {
      setToast({ kind: "error", text: "Could not submit review" });
    } finally {
      setSubmitting(false);
    }
  };

  if (collapsed) {
    return (
      <>
        <style>{styles}</style>
        <button
          class="minimize-chip"
          type="button"
          aria-label="Expand Optio picker"
          onClick={toggleCollapsed}
        >
          <PipetteIcon size={22} />
        </button>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div class="dock" ref={dockRef}>
        {toast && (
          <output class={`toast toast-${toast.kind}`} aria-live="polite">
            <span class="toast-icon">
              {toast.kind === "success" ? <CheckCircleIcon /> : <AlertIcon />}
            </span>
            <span>{toast.text}</span>
          </output>
        )}
        {reviewOpen && (
          <div class="review-panel-wrap">
            <section class="review-panel" aria-label="Completing review">
              <div class="review-title">Completing review</div>
              <div class="review-accordion">
                {[...blocks.keys()].map((block) => (
                  <AccordionItem
                    key={block}
                    block={block}
                    current={state[block] ?? blocks.get(block)?.[0] ?? ""}
                    comment={comments[block] ?? ""}
                    open={openAccordion === block}
                    onToggle={() => setOpenAccordion((curr) => (curr === block ? null : block))}
                    onCommentChange={(value) => setComments((c) => ({ ...c, [block]: value }))}
                  />
                ))}
              </div>
              <div class="review-actions">
                <button class="cancel-btn" type="button" onClick={handleCancelReview}>
                  Cancel
                </button>
                <button
                  class="primary-btn"
                  type="button"
                  disabled={submitting}
                  onClick={handleSubmitReview}
                >
                  {submitting ? "Submitting..." : "Complete review"}
                </button>
              </div>
            </section>
          </div>
        )}
        <div class="toolbar">
          <div class="brand">
            <span class="brand-mark">
              <PipetteIcon />
            </span>
            <span class="brand-name">optio</span>
          </div>
          <div class="steppers" ref={steppersRef}>
            {[...blocks].map(([block, variants]) => (
              <Stepper
                key={block}
                block={block}
                variants={variants}
                current={state[block] ?? variants[0] ?? ""}
                dropdownOpen={openDropdown === block}
                onSelect={onSelect}
                onResetBlock={onResetBlock}
                onToggleDropdown={setOpenDropdown}
                registerRef={(el) => {
                  if (el) stepperRefs.current.set(block, el);
                  else stepperRefs.current.delete(block);
                }}
              />
            ))}
          </div>
          <div class="actions">
            <button class="primary-btn" type="button" onClick={handleOpenReview}>
              Complete review
            </button>
            <button class="icon-btn icon-btn-danger" type="button" aria-label="Report a bug">
              <BugIcon />
            </button>
            <button class="icon-btn" type="button" aria-label="Help">
              <QuestionIcon />
            </button>
            <button
              class="icon-btn"
              type="button"
              aria-label="Minimize picker"
              onClick={toggleCollapsed}
            >
              <MinimizeIcon />
            </button>
          </div>
        </div>
        {openDropdown &&
          dropdownGeom &&
          (() => {
            const variants = blocks.get(openDropdown);
            if (!variants) return null;
            const current = state[openDropdown] ?? variants[0] ?? "";
            return (
              <div
                class="variant-dropdown"
                aria-label={`${openDropdown} variants`}
                style={`left: ${dropdownGeom.left}px; bottom: ${dropdownGeom.bottom}px; width: ${dropdownGeom.width}px;`}
              >
                {variants.map((v) => {
                  const active = v === current;
                  return (
                    <button
                      key={v}
                      class={`variant-option${active ? " active" : ""}`}
                      type="button"
                      aria-pressed={active}
                      onClick={() => {
                        onSelect(openDropdown, v);
                        setOpenDropdown(null);
                      }}
                    >
                      <span class="variant-option-label">{v}</span>
                      {active && (
                        <span class="variant-option-check">
                          <CheckIcon />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })()}
      </div>
    </>
  );
}
