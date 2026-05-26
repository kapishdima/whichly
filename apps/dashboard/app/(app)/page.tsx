import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/session";
import { Badge } from "@optio/ui/components/badge";
import { Card, CardContent } from "@optio/ui/components/card";
import { Empty, EmptyContent, EmptyDescription, EmptyTitle } from "@optio/ui/components/empty";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { NewProjectForm } from "./_components/new-project-form";
import { PageHeader } from "./_components/page-header";

export default async function ProjectsListPage() {
  const session = await requireSession();
  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, createdAt: true, _count: { select: { reviews: true } } },
  });

  return (
    <>
      <PageHeader crumbs={[{ label: "Projects" }]} />
      <div className="flex flex-1 flex-col gap-8 px-4 py-8 lg:px-6 lg:py-10">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
          <header className="flex flex-col gap-1">
            <h1 className="text-balance text-2xl font-semibold tracking-tight">Projects</h1>
            <p className="text-sm text-muted-foreground">
              Spin up a new project and share the staging link with your client.
            </p>
          </header>

          <NewProjectForm />

          {projects.length === 0 ? (
            <Empty>
              <EmptyContent>
                <EmptyTitle>No projects yet</EmptyTitle>
                <EmptyDescription>Create your first one above to get started.</EmptyDescription>
              </EmptyContent>
            </Empty>
          ) : (
            <Card className="gap-0 py-0">
              <CardContent className="p-0">
                <ul role="list" className="divide-y">
                  {projects.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/projects/${p.id}`}
                        className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-muted/40"
                      >
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium">{p.name}</span>
                          <span className="text-xs text-muted-foreground tabular-nums">
                            Created {new Date(p.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="tabular-nums">
                            {p._count.reviews} {p._count.reviews === 1 ? "review" : "reviews"}
                          </Badge>
                          <ChevronRightIcon className="size-4 text-muted-foreground" />
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
