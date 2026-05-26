"use client";

import { Button } from "@optio/ui/components/button";
import { Input } from "@optio/ui/components/input";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";

export function NewProjectForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    });
    setSubmitting(false);
    if (!res.ok) {
      toast.error("Failed to create project");
      return;
    }
    const { project } = (await res.json()) as { project: { id: string } };
    router.push(`/projects/${project.id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New project name..."
        aria-label="New project name"
        className="flex-1"
      />
      <Button type="submit" disabled={submitting || !name.trim()}>
        <PlusIcon data-icon="inline-start" />
        {submitting ? "Creating..." : "Create"}
      </Button>
    </form>
  );
}
