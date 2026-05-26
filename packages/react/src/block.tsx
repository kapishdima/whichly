"use client";

import { createContext, type ReactNode, useContext } from "react";

interface BlockContextValue {
  name: string;
}

const BlockContext = createContext<BlockContextValue | null>(null);

export function useBlockContext(): BlockContextValue {
  const ctx = useContext(BlockContext);
  if (!ctx) {
    throw new Error("<Variant> must be rendered inside <Block>");
  }
  return ctx;
}

export interface BlockProps {
  name: string;
  children: ReactNode;
}

export function Block({ name, children }: BlockProps) {
  return <BlockContext.Provider value={{ name }}>{children}</BlockContext.Provider>;
}
