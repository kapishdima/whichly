"use client";

import { Button } from "@optio/ui/components/button";
import { Card } from "@optio/ui/components/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@optio/ui/components/field";
import { Input } from "@optio/ui/components/input";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";

interface RenameProjectFormProps {
  projectId: string;
  initialName: string;
}

export function RenameProjectForm({ projectId, initialName }: RenameProjectFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [submitting, setSubmitting] = useState(false);

  const trimmed = name.trim();
  const dirty = trimmed.length > 0 && trimmed !== initialName;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!dirty) return;
    setSubmitting(true);
    const res = await fetch(`/api/projects/${projectId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: trimmed }),
    });
    setSubmitting(false);
    if (res.ok) {
      toast.success("Project renamed");
      router.refresh();
    } else {
      toast.error("Failed to rename project");
    }
  }

  return (
    <Card className="gap-0 py-0">
      <div className="flex flex-col gap-1 border-b px-5 py-4">
        <h3 className="text-sm font-semibold">General</h3>
        <p className="text-xs text-muted-foreground">Update your project details.</p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-5 py-5">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="project-name">Project name</FieldLabel>
            <Input
              id="project-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={120}
              autoComplete="off"
              placeholder="My project"
            />
            <FieldDescription>Shown in the sidebar header and review summaries.</FieldDescription>
          </Field>
        </FieldGroup>
        <div className="flex justify-end">
          <Button type="submit" size="sm" disabled={!dirty || submitting}>
            {submitting ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
