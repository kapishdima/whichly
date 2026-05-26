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
        <div className="flex w-full flex-col gap-8">
          <header className="flex flex-col gap-1">
            <h1 className="text-balance text-2xl font-semibold">Projects</h1>
            <p className="text-pretty text-sm text-muted-foreground">
              Spin up a new project and share the staging link with your client.
            </p>
          </header>

          <div className="max-w-2xl">
            <NewProjectForm />
          </div>

          {projects.length === 0 ? (
            <Empty>
              <EmptyContent>
                <EmptyTitle>No projects yet</EmptyTitle>
                <EmptyDescription>Create your first one above to get started.</EmptyDescription>
              </EmptyContent>
            </Empty>
          ) : (
            <ul role="list" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/projects/${p.id}`}
                    className="group block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <Card className="h-full gap-0 py-0 transition-colors group-hover:bg-muted/40">
                      <CardContent className="flex h-full flex-col gap-6 p-5">
                        <div className="flex items-start justify-between gap-3">
                          <span className="line-clamp-2 text-balance font-medium">{p.name}</span>
                          <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                        </div>
                        <div className="mt-auto flex items-center justify-between gap-3">
                          <span className="text-xs text-muted-foreground tabular-nums">
                            {new Date(p.createdAt).toLocaleDateString()}
                          </span>
                          <Badge variant="secondary" className="tabular-nums">
                            {p._count.reviews} {p._count.reviews === 1 ? "review" : "reviews"}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
