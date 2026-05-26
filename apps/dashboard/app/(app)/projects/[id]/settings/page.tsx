import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/session";
import { notFound } from "next/navigation";
import { PageHeader } from "../../../_components/page-header";
import { ProjectSubheader } from "../_components/project-subheader";
import { DangerZone } from "./_components/danger-zone";
import { EmbedSnippets } from "./_components/embed-snippets";
import { ProjectIdField } from "./_components/project-id-field";
import { RenameProjectForm } from "./_components/rename-project-form";
import { SettingsTabs } from "./_components/settings-tabs";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectSettingsPage({ params }: PageProps) {
  const session = await requireSession();
  const { id } = await params;

  const project = await prisma.project.findFirst({
    where: { id, userId: session.user.id },
    select: { id: true, name: true },
  });
  if (!project) notFound();

  return (
    <>
      <PageHeader
        crumbs={[
          { label: "Projects", href: "/" },
          { label: project.name, href: `/projects/${project.id}` },
          { label: "Settings" },
        ]}
        subheader={
          <ProjectSubheader
            projectId={project.id}
            projectName={project.name}
            showSettingsLink={false}
          />
        }
      />

      <div className="flex flex-1 flex-col gap-8 px-4 py-8 lg:px-6 lg:py-10">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
          <SettingsTabs
            mainContent={
              <>
                <RenameProjectForm projectId={project.id} initialName={project.name} />
                <DangerZone projectId={project.id} projectName={project.name} />
              </>
            }
            embedContent={
              <>
                <div className="flex flex-col gap-1">
                  <h2 className="text-sm font-semibold">Embed snippet</h2>
                  <p className="text-sm text-muted-foreground">
                    Add this to your staging site to enable the picker.
                  </p>
                </div>
                <ProjectIdField projectId={project.id} />
                <EmbedSnippets projectId={project.id} />
              </>
            }
          />
        </div>
      </div>
    </>
  );
}
