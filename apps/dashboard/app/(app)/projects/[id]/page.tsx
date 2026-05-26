import { prisma } from "@/lib/db";
import type { ReviewItem } from "@/lib/schemas/review";
import { requireSession } from "@/lib/session";
import { Badge } from "@optio/ui/components/badge";
import { Button } from "@optio/ui/components/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@optio/ui/components/card";
import { Empty, EmptyContent, EmptyDescription, EmptyTitle } from "@optio/ui/components/empty";
import { SettingsIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "../../_components/page-header";
import { ProjectSubheader } from "./_components/project-subheader";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: PageProps) {
  const session = await requireSession();
  const { id } = await params;

  const project = await prisma.project.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!project) notFound();

  const reviews = await prisma.review.findMany({
    where: { projectId: id },
    orderBy: { submittedAt: "desc" },
    take: 100,
  });

  const blockCount = new Set(
    reviews.flatMap((r) => (r.items as unknown as ReviewItem[]).map((i) => i.block)),
  ).size;
  const lastReview = reviews[0];

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Projects", href: "/" }, { label: project.name }]}
        subheader={<ProjectSubheader projectId={project.id} projectName={project.name} />}
      />

      <div className="flex flex-1 flex-col gap-8 px-4 py-8 lg:px-6 lg:py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
          <section aria-label="Overview">
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Card className="gap-0 py-5">
                <CardHeader className="px-5">
                  <CardDescription className="truncate text-xs font-medium ">
                    Reviews
                  </CardDescription>
                  <CardTitle className="text-3xl font-semibold tabular-nums ">
                    {reviews.length}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card className="gap-0 py-5">
                <CardHeader className="px-5">
                  <CardDescription className="truncate text-xs font-medium ">
                    Blocks
                  </CardDescription>
                  <CardTitle className="text-3xl font-semibold tabular-nums ">
                    {blockCount}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card className="gap-0 py-5">
                <CardHeader className="px-5">
                  <CardDescription className="truncate text-xs font-medium ">
                    Last submitted
                  </CardDescription>
                  <CardTitle className="text-base font-medium">
                    {lastReview ? (
                      <span className="tabular-nums">
                        {new Date(lastReview.submittedAt).toLocaleString(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </CardTitle>
                </CardHeader>
              </Card>
            </dl>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold  text-muted-foreground">Reviews</h2>
            {reviews.length === 0 ? (
              <Empty>
                <EmptyContent>
                  <EmptyTitle>No reviews yet</EmptyTitle>
                  <EmptyDescription>
                    Embed the snippet from Settings → Embed, deploy to staging, and share the URL
                    with your client.
                  </EmptyDescription>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/projects/${project.id}/settings`}>
                      <SettingsIcon data-icon="inline-start" />
                      Settings
                    </Link>
                  </Button>
                </EmptyContent>
              </Empty>
            ) : (
              <Card className="gap-0 py-0">
                <ul role="list" className="divide-y">
                  {reviews.map((r) => {
                    const items = r.items as unknown as ReviewItem[];
                    return (
                      <li key={r.id} className="px-5 py-4 transition-colors hover:bg-muted/40">
                        <div className="mb-3 flex items-baseline justify-between gap-4">
                          <span className="text-sm font-medium tabular-nums">
                            {new Date(r.submittedAt).toLocaleString(undefined, {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </span>
                          <Badge variant="secondary" className="tabular-nums">
                            {items.length} {items.length === 1 ? "block" : "blocks"}
                          </Badge>
                        </div>
                        <ul role="list" className="flex flex-col gap-2">
                          {items.map((item, idx) => (
                            <li key={`${r.id}-${idx}`} className="text-sm">
                              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                                <span className="font-medium">{item.block}</span>
                                <span className="text-muted-foreground">→</span>
                                <span>{item.variant}</span>
                              </div>
                              {item.comment && (
                                <p className="mt-1 border-l-2 border-border pl-3 text-pretty text-sm leading-6 text-muted-foreground">
                                  {item.comment}
                                </p>
                              )}
                            </li>
                          ))}
                        </ul>
                      </li>
                    );
                  })}
                </ul>
              </Card>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
