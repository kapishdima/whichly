import { Button } from "@optio/ui/components/button";
import { SettingsIcon } from "lucide-react";
import Link from "next/link";

interface ProjectSubheaderProps {
  projectId: string;
  projectName: string;
  showSettingsLink?: boolean;
}

export function ProjectSubheader({
  projectId,
  projectName,
  showSettingsLink = true,
}: ProjectSubheaderProps) {
  return (
    <div className="flex w-full items-center justify-between gap-4">
      <h1 className="min-w-0 truncate text-lg font-semibold tracking-tight">{projectName}</h1>
      {showSettingsLink ? (
        <Button variant="outline" size="sm" asChild>
          <Link href={`/projects/${projectId}/settings`}>
            <SettingsIcon data-icon="inline-start" />
            Settings
          </Link>
        </Button>
      ) : null}
    </div>
  );
}
