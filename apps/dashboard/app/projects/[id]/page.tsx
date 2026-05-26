import { prisma } from "@/lib/db";
import type { ReviewItem } from "@/lib/schemas/review";
import { requireSession } from "@/lib/session";
import { Badge } from "@optio/ui/components/badge";
import { Button } from "@optio/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@optio/ui/components/card";
import { Empty, EmptyContent, EmptyDescription, EmptyTitle } from "@optio/ui/components/empty";
import { Separator } from "@optio/ui/components/separator";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectActions } from "./_components/project-actions";
import { Snippets } from "./_components/snippets";

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
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ArrowLeftIcon data-icon="inline-start" />
            All projects
          </Link>
        </Button>
        <Badge variant="outline" className="font-mono tabular-nums">
          {project.id}
        </Badge>
      </div>

      <header className="mb-10 flex flex-col gap-8">
        <ProjectActions projectId={project.id} initialName={project.name} />

        <Separator />

        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="gap-0 py-5">
            <CardHeader className="px-5">
              <CardDescription className="truncate text-xs font-medium uppercase tracking-wide">
                Reviews
              </CardDescription>
              <CardTitle className="text-3xl font-semibold tabular-nums tracking-tight">
                {reviews.length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="gap-0 py-5">
            <CardHeader className="px-5">
              <CardDescription className="truncate text-xs font-medium uppercase tracking-wide">
                Blocks
              </CardDescription>
              <CardTitle className="text-3xl font-semibold tabular-nums tracking-tight">
                {blockCount}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="gap-0 py-5">
            <CardHeader className="px-5">
              <CardDescription className="truncate text-xs font-medium uppercase tracking-wide">
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
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Reviews
          </h2>
          {reviews.length === 0 ? (
            <Empty>
              <EmptyContent>
                <EmptyTitle>No reviews yet</EmptyTitle>
                <EmptyDescription>
                  Embed the snippet, deploy to staging, and share the URL with your client.
                </EmptyDescription>
              </EmptyContent>
            </Empty>
          ) : (
            <Card className="gap-0 py-0">
              <CardContent className="p-0">
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
              </CardContent>
            </Card>
          )}
        </section>

        <aside className="flex flex-col gap-6 lg:sticky lg:top-10 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle>Embed</CardTitle>
              <CardDescription>Add this to your staging site to enable the picker.</CardDescription>
            </CardHeader>
            <CardContent>
              <Snippets projectId={project.id} />
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  );
}
