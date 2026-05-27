"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check } from "lucide-react";
import { type ComponentPropsWithoutRef, type ElementRef, forwardRef } from "react";
import { cn } from "../../lib/utils";
import { useShadowRoot } from "../shadow-context";

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

export const DropdownMenuContent = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 6, ...props }, ref) => {
  const shadowRoot = useShadowRoot();
  return (
    <DropdownMenuPrimitive.Portal container={shadowRoot ?? undefined}>
      <DropdownMenuPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[160px] overflow-y-auto max-h-[240px] rounded-[10px] border border-white/15 bg-[#262626] p-1 text-white shadow-[0_12px_32px_rgba(0,0,0,0.4)] flex flex-col gap-px",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          className,
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
});
DropdownMenuContent.displayName = "DropdownMenuContent";

export const DropdownMenuItem = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Item>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & { selected?: boolean }
>(({ className, selected, children, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.Item
      ref={ref}
      className={cn(
        "flex items-center w-full text-left px-2.5 py-1.5 text-xs text-white/85 rounded-md cursor-pointer outline-none",
        "focus:bg-[#303030] focus:text-white",
        "data-[highlighted]:bg-[#303030] data-[highlighted]:text-white",
        selected && "bg-[#303030] text-white",
        className,
      )}
      {...props}
    >
      <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{children}</span>
      {selected && <Check className="ml-2 size-3 text-sky-500" strokeWidth={2.5} />}
    </DropdownMenuPrimitive.Item>
  );
});
DropdownMenuItem.displayName = "DropdownMenuItem";
