"use client";

import { useState } from "react";

interface SnippetsProps {
  projectId: string;
}

const TABS = ["React", "HTML"] as const;
type Tab = (typeof TABS)[number];

export function Snippets({ projectId }: SnippetsProps) {
  const [tab, setTab] = useState<Tab>("React");
  const [copied, setCopied] = useState(false);

  const reactSnippet = `import { OptioProvider } from "@optio/react";

export default function Layout({ children }) {
  return (
    <OptioProvider projectId="${projectId}">
      {children}
    </OptioProvider>
  );
}`;

  const htmlSnippet = `<script
  src="https://cdn.optio.dev/optio.js"
  data-project-id="${projectId}"
  async
></script>`;

  const code = tab === "React" ? reactSnippet : htmlSnippet;

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex gap-1 rounded-md border border-border p-0.5">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded px-3 py-1 text-xs font-medium ${
                t === tab ? "bg-secondary text-foreground" : "text-muted-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto rounded-md bg-secondary p-4 text-xs">
        <code>{code}</code>
      </pre>
    </div>
  );
}
