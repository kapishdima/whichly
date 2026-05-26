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
import { Card } from "@optio/ui/components/card";
import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface DangerZoneProps {
  projectId: string;
  projectName: string;
}

export function DangerZone({ projectId, projectName }: DangerZoneProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

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

  return (
    <Card className="gap-0 border-destructive/40 py-0">
      <div className="flex flex-col gap-1 border-b border-destructive/20 bg-destructive/5 px-5 py-4">
        <h3 className="text-sm font-semibold text-destructive">Danger zone</h3>
        <p className="text-xs text-muted-foreground">
          Irreversible actions. Be sure before proceeding.
        </p>
      </div>
      <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">Delete this project</p>
          <p className="text-sm text-muted-foreground">
            Permanently delete <span className="font-medium">{projectName}</span> and all of its
            reviews. This cannot be undone.
          </p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button type="button" variant="destructive" size="sm" className="shrink-0">
              <Trash2Icon data-icon="inline-start" />
              Delete project
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this project?</AlertDialogTitle>
              <AlertDialogDescription>
                This permanently deletes <span className="font-medium">{projectName}</span> and all
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
    </Card>
  );
}
