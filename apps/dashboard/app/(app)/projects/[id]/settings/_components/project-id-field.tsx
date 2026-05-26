"use client";

import { Field, FieldDescription, FieldLabel } from "@optio/ui/components/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@optio/ui/components/input-group";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ProjectIdFieldProps {
  projectId: string;
}

export function ProjectIdField({ projectId }: ProjectIdFieldProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(projectId);
    setCopied(true);
    toast.success("Project ID copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Field>
      <FieldLabel htmlFor="project-id">Project ID</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id="project-id"
          readOnly
          value={projectId}
          className="font-mono text-xs"
          onFocus={(e) => e.currentTarget.select()}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-xs" aria-label="Copy project ID" onClick={handleCopy}>
            {copied ? <CheckIcon /> : <CopyIcon />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <FieldDescription>
        Used to wire the snippet to this project. Treat it as public.
      </FieldDescription>
    </Field>
  );
}
