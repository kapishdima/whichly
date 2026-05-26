"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@optio/ui/components/alert-dialog";
import { Button } from "@optio/ui/components/button";
import { Input } from "@optio/ui/components/input";
import { CheckIcon, PencilIcon, Trash2Icon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";

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
      setName(initialName);
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
      toast.success("Project renamed");
      setEditing(false);
      router.refresh();
    } else {
      toast.error("Failed to rename project");
    }
  }

  async function handleDelete() {
    setSubmitting(true);
    const res = await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Project deleted");
      router.push("/");
      router.refresh();
    } else {
      toast.error("Failed to delete project");
      setSubmitting(false);
    }
  }

  if (editing) {
    return (
      <form onSubmit={handleRename} className="flex items-center gap-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-label="Project name"
          className="h-10 max-w-md text-2xl font-semibold tracking-tight"
        />
        <Button type="submit" size="icon" variant="default" disabled={submitting} aria-label="Save">
          <CheckIcon />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => {
            setName(initialName);
            setEditing(false);
          }}
          aria-label="Cancel"
        >
          <XIcon />
        </Button>
      </form>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <h1 className="text-balance text-3xl font-semibold tracking-tight">{initialName}</h1>
      <Button
        type="button"
        size="icon-sm"
        variant="ghost"
        onClick={() => setEditing(true)}
        aria-label="Rename project"
      >
        <PencilIcon />
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            aria-label="Delete project"
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2Icon />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this project?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes <span className="font-medium">{initialName}</span> and all
              its reviews. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete} disabled={submitting}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
