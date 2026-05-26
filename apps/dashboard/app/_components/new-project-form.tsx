"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

export function NewProjectForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    });
    setSubmitting(false);
    if (!res.ok) {
      setError("Failed to create project");
      return;
    }
    const { project } = (await res.json()) as { project: { id: string } };
    router.push(`/projects/${project.id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New project name..."
        className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
      <button
        type="submit"
        disabled={submitting || !name.trim()}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
      >
        {submitting ? "Creating..." : "Create"}
      </button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </form>
  );
}
