"use client";

import { Button } from "@optio/ui/components/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@optio/ui/components/tabs";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SnippetsProps {
  projectId: string;
}

export function Snippets({ projectId }: SnippetsProps) {
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

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

  async function handleCopy(tab: "react" | "html", code: string) {
    await navigator.clipboard.writeText(code);
    setCopiedTab(tab);
    toast.success("Snippet copied to clipboard");
    setTimeout(() => setCopiedTab((curr) => (curr === tab ? null : curr)), 1500);
  }

  return (
    <Tabs defaultValue="react">
      <TabsList className="w-full">
        <TabsTrigger value="react">React</TabsTrigger>
        <TabsTrigger value="html">HTML</TabsTrigger>
      </TabsList>
      <TabsContent value="react" className="relative">
        <pre className="overflow-x-auto rounded-md border bg-muted/50 p-4 text-xs leading-5">
          <code>{reactSnippet}</code>
        </pre>
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          className="absolute right-2 top-2"
          onClick={() => handleCopy("react", reactSnippet)}
          aria-label="Copy React snippet"
        >
          {copiedTab === "react" ? <CheckIcon /> : <CopyIcon />}
        </Button>
      </TabsContent>
      <TabsContent value="html" className="relative">
        <pre className="overflow-x-auto rounded-md border bg-muted/50 p-4 text-xs leading-5">
          <code>{htmlSnippet}</code>
        </pre>
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          className="absolute right-2 top-2"
          onClick={() => handleCopy("html", htmlSnippet)}
          aria-label="Copy HTML snippet"
        >
          {copiedTab === "html" ? <CheckIcon /> : <CopyIcon />}
        </Button>
      </TabsContent>
    </Tabs>
  );
}
