"use client";

import type { ReactNode } from "react";
import { useBlockContext } from "./block";

export interface VariantProps {
  name: string;
  children: ReactNode;
}

export function Variant({ name, children }: VariantProps) {
  const { name: blockName, active } = useBlockContext();
  const isActive = name === active;
  return (
    <div
      data-vp-block={blockName}
      data-vp-variant={name}
      style={{ display: isActive ? "contents" : "none" }}
    >
      {children}
    </div>
  );
}
