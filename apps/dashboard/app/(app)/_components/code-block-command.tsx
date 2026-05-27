"use client";

import { Button } from "@optio/ui/components/button";
import { cn } from "@optio/ui/lib/utils";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const MANAGERS = [
  { id: "pnpm", prefix: "pnpm add" },
  { id: "npm", prefix: "npm install" },
  { id: "yarn", prefix: "yarn add" },
  { id: "bun", prefix: "bun add" },
] as const;

type ManagerId = (typeof MANAGERS)[number]["id"];

interface CodeBlockCommandProps {
  packageName: string;
  defaultManager?: ManagerId;
}

export function CodeBlockCommand({ packageName, defaultManager = "pnpm" }: CodeBlockCommandProps) {
  const [active, setActive] = useState<ManagerId>(defaultManager);
  const [copied, setCopied] = useState(false);

  const current = MANAGERS.find((m) => m.id === active) ?? MANAGERS[0];
  const command = `${current.prefix} ${packageName}`;

  async function handleCopy() {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    toast.success("Command copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="overflow-hidden rounded-md border bg-card">
      <div className="flex items-center gap-px border-b px-1">
        {MANAGERS.map((m) => {
          const isActive = m.id === active;
          return (
            <button
              key={m.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActive(m.id)}
              className={cn(
                "relative h-9 px-3 text-xs font-medium transition-colors",
                isActive
                  ? "text-foreground after:absolute after:inset-x-3 after:bottom-[-1px] after:h-px after:bg-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {m.id}
            </button>
          );
        })}
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          className="ml-auto"
          onClick={handleCopy}
          aria-label="Copy command"
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </Button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-xs leading-6 text-foreground">
        <span aria-hidden="true" className="text-muted-foreground">
          ${" "}
        </span>
        {command}
      </pre>
    </div>
  );
}
