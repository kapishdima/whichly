import { prisma } from "@/lib/db";
import type { ReviewItem } from "@/lib/schemas/review";
import { requireSession } from "@/lib/session";
import { Badge } from "@optio/ui/components/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@optio/ui/components/card";
import { notFound } from "next/navigation";
import { PageHeader } from "../../_components/page-header";
import { ProjectSetup } from "./_components/project-setup";
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

  const hasReviews = reviews.length > 0;

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Projects", href: "/" }, { label: project.name }]}
        subheader={<ProjectSubheader projectId={project.id} projectName={project.name} />}
      />

      <div className="flex flex-1 flex-col gap-8 px-4 py-8 lg:px-6 lg:py-10">
        {hasReviews ? (
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
            <ProjectOverview reviews={reviews} />
            <ReviewsList reviews={reviews} />
          </div>
        ) : (
          <ProjectSetup projectId={project.id} projectName={project.name} />
        )}
      </div>
    </>
  );
}

function ProjectOverview({
  reviews,
}: {
  reviews: { submittedAt: Date; items: unknown }[];
}) {
  const blockCount = new Set(
    reviews.flatMap((r) => (r.items as unknown as ReviewItem[]).map((i) => i.block)),
  ).size;
  const lastReview = reviews[0];

  return (
    <section aria-label="Overview">
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="gap-0 py-5">
          <CardHeader className="px-5">
            <CardDescription className="truncate text-xs font-medium">Reviews</CardDescription>
            <CardTitle className="text-3xl font-semibold tabular-nums">{reviews.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="gap-0 py-5">
          <CardHeader className="px-5">
            <CardDescription className="truncate text-xs font-medium">Blocks</CardDescription>
            <CardTitle className="text-3xl font-semibold tabular-nums">{blockCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="gap-0 py-5">
          <CardHeader className="px-5">
            <CardDescription className="truncate text-xs font-medium">
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
  );
}

function ReviewsList({
  reviews,
}: {
  reviews: { id: string; submittedAt: Date; items: unknown }[];
}) {
  const rows = reviews.flatMap((r) => {
    const items = r.items as unknown as ReviewItem[];
    return items.map((item, idx) => ({
      key: `${r.id}-${idx}`,
      submittedAt: r.submittedAt,
      ...item,
    }));
  });

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold text-muted-foreground">Reviews</h2>
      <Card className="gap-0 overflow-hidden py-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/40">
              <tr>
                <th className="px-5 py-3 text-sm font-semibold text-muted-foreground">Date</th>
                <th className="px-5 py-3 text-sm font-semibold text-muted-foreground">Block</th>
                <th className="px-5 py-3 text-sm font-semibold text-muted-foreground">Variant</th>
                <th className="px-5 py-3 text-sm font-semibold text-muted-foreground">Comment</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.map((row) => (
                <tr key={row.key} className="transition-colors hover:bg-muted/30">
                  <td className="px-5 py-3 whitespace-nowrap tabular-nums text-muted-foreground">
                    {new Date(row.submittedAt).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="px-5 py-3 font-mono">{row.block}</td>
                  <td className="px-5 py-3 font-medium">{row.variant}</td>
                  <td className="px-5 py-3 text-pretty text-muted-foreground">
                    {row.comment || <span className="text-muted-foreground/60">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
}
