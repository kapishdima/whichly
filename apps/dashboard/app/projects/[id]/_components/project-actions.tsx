"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

interface ProjectActionsProps {
  projectId: string;
  initialName: string;
}

export function ProjectActions({ projectId, initialName }: ProjectActionsProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(initialName);
  const [submitting, setSubmitting] = useState(false);

  async function handleRename(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || name === initialName) {
      setEditing(false);
      return;
    }
    setSubmitting(true);
    const res = await fetch(`/api/projects/${projectId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    });
    setSubmitting(false);
    if (res.ok) {
      setEditing(false);
      router.refresh();
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this project and all its reviews?")) return;
    setSubmitting(true);
    const res = await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      setSubmitting(false);
    }
  }

  if (editing) {
    return (
      <form onSubmit={handleRename} className="flex items-center gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-md border border-input bg-background px-2 py-1 text-lg font-semibold outline-none focus:ring-2 focus:ring-ring"
        />
        <button type="submit" disabled={submitting} className="text-sm font-medium text-foreground">
          Save
        </button>
        <button
          type="button"
          onClick={() => {
            setName(initialName);
            setEditing(false);
          }}
          className="text-sm text-muted-foreground"
        >
          Cancel
        </button>
      </form>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <h1 className="text-2xl font-semibold tracking-tight">{initialName}</h1>
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        Rename
      </button>
      <button
        type="button"
        onClick={handleDelete}
        disabled={submitting}
        className="text-sm text-destructive hover:opacity-80 disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
