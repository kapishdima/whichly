"use client";

import {
  Children,
  createContext,
  isValidElement,
  type ReactNode,
  useContext,
  useEffect,
  useId,
  useMemo,
} from "react";
import { useOptio } from "./provider";

interface BlockContextValue {
  name: string;
  active: string;
}

const BlockContext = createContext<BlockContextValue | null>(null);

export function useBlockContext(): BlockContextValue {
  const ctx = useContext(BlockContext);
  if (!ctx) {
    throw new Error("<Optio.Variant> must be rendered inside <Optio.Block>");
  }
  return ctx;
}

export interface BlockProps {
  name: string;
  children: ReactNode;
}

function extractVariantNames(children: ReactNode): string[] {
  const names: string[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    const childName = (child.props as { name?: unknown }).name;
    if (typeof childName === "string") names.push(childName);
  });
  return names;
}

export function Block({ name, children }: BlockProps) {
  const { register, unregister, getActive } = useOptio();
  const instanceId = useId();

  const variantNames = useMemo(() => extractVariantNames(children), [children]);
  const variantKey = variantNames.join("|");

  useEffect(() => {
    register(name, instanceId, variantNames);
    return () => unregister(name, instanceId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, instanceId, variantKey, register, unregister]);

  const active = getActive(name) ?? variantNames[0] ?? "";

  const value = useMemo(() => ({ name, active }), [name, active]);

  return <BlockContext.Provider value={value}>{children}</BlockContext.Provider>;
}
