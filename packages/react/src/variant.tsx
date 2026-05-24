import type { ReactNode } from "react";

export interface VariantProps {
  id: string;
  children: ReactNode;
}

export function Variant({ children }: VariantProps) {
  return <>{children}</>;
}
