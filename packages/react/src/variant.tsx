"use client";

import type { ReactNode } from "react";
import { useBlockContext } from "./block";

export interface VariantProps {
  name: string;
  children: ReactNode;
}

export function Variant({ name, children }: VariantProps) {
  const { name: blockName } = useBlockContext();
  return (
    <div data-vp-block={blockName} data-vp-variant={name}>
      {children}
    </div>
  );
}
