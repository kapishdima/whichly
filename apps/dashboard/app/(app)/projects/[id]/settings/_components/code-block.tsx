"use client";

import { Button } from "@optio/ui/components/button";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CodeBlockProps {
  code: string;
  html: string;
  label: string;
}

export function CodeBlock({ code, html, label }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Snippet copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="group/code relative overflow-hidden rounded-md border bg-card">
      <div
        className="overflow-x-auto p-4 text-xs leading-6 [&_pre]:!bg-transparent [&_pre]:!p-0 [&_pre]:!m-0 [&_pre]:font-mono"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted output from Shiki
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <Button
        type="button"
        size="icon-sm"
        variant="ghost"
        className="absolute right-2 top-2 opacity-0 transition-opacity group-hover/code:opacity-100 focus-visible:opacity-100"
        onClick={handleCopy}
        aria-label={`Copy ${label} snippet`}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </Button>
    </div>
  );
}
