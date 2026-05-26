import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import type { ReviewItem } from "@/lib/schemas/review";
import { requireSession } from "@/lib/session";
import { ProjectActions } from "./_components/project-actions";
import { Snippets } from "./_components/snippets";

interface PageProps {
  params: Promise<{ id: string }>;
}

type ReviewRow = { id: string; submittedAt: Date; items: unknown };

type Aggregate = {
  block: string;
  total: number;
  variants: {
    name: string;
    count: number;
    pct: number;
    comments: { text: string; submittedAt: Date }[];
  }[];
};

function buildAggregates(reviews: ReviewRow[]): Aggregate[] {
  const map = new Map<string, Map<string, { count: number; comments: { text: string; submittedAt: Date }[] }>>();
  for (const r of reviews) {
    const items = r.items as ReviewItem[];
    for (const it of items) {
      let bm = map.get(it.block);
      if (!bm) {
        bm = new Map();
        map.set(it.block, bm);
      }
      let ve = bm.get(it.variant);
      if (!ve) {
        ve = { count: 0, comments: [] };
        bm.set(it.variant, ve);
      }
      ve.count += 1;
      if (it.comment) ve.comments.push({ text: it.comment, submittedAt: r.submittedAt });
    }
  }
  return Array.from(map.entries())
    .map(([block, vm]) => {
      const variants = Array.from(vm.entries())
        .map(([name, v]) => ({ name, count: v.count, pct: 0, comments: v.comments }))
        .sort((a, b) => b.count - a.count);
      const total = variants.reduce((s, v) => s + v.count, 0);
      for (const v of variants) v.pct = total ? Math.round((v.count / total) * 100) : 0;
      return { block, total, variants };
    })
    .sort((a, b) => b.total - a.total);
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

  const aggregates = buildAggregates(reviews);
  const blockCount = aggregates.length;
  const lastReview = reviews[0];

  return (
    <div data-uidotsh-pick="Project page direction" className="contents">
      {/* ─────────────────────────────────────────────────────────────────────────
         Option 1 — Minimal Stack (current)
         ───────────────────────────────────────────────────────────────────────── */}
      <div data-uidotsh-option="Minimal Stack (current)" className="contents">
        <main className="mx-auto max-w-3xl space-y-8 px-6 py-12">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← All projects
          </Link>

          <ProjectActions projectId={project.id} initialName={project.name} />

          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Snippet
            </h2>
            <Snippets projectId={project.id} />
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Reviews ({reviews.length})
            </h2>
            {reviews.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Waiting for first review. Embed the snippet above and share your staging URL.
                </p>
              </div>
            ) : (
              <ul role="list" className="space-y-3">
                {reviews.map((r) => {
                  const items = r.items as unknown as ReviewItem[];
                  return (
                    <li key={r.id} className="rounded-lg border border-border p-4">
                      <div className="mb-3 text-xs text-muted-foreground tabular-nums">
                        {new Date(r.submittedAt).toLocaleString()}
                      </div>
                      <dl className="space-y-2">
                        {items.map((item, idx) => (
                          <div key={`${r.id}-${idx}`} className="text-sm">
                            <dt className="inline font-medium">{item.block}</dt>
                            <span className="text-muted-foreground"> → </span>
                            <dd className="inline">{item.variant}</dd>
                            {item.comment && (
                              <p className="mt-1 ml-4 text-muted-foreground">“{item.comment}”</p>
                            )}
                          </div>
                        ))}
                      </dl>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </main>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────
         Option 2 — Editorial Workbench
         Stats strip + two-column with sticky sidebar holding snippet & meta.
         ───────────────────────────────────────────────────────────────────────── */}
      <div data-uidotsh-option="Editorial Workbench" className="contents" hidden>
        <main className="mx-auto max-w-6xl px-6 py-10">
          <div className="mb-8 flex items-center justify-between">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              ← All projects
            </Link>
            <div className="text-xs uppercase tracking-wide text-muted-foreground tabular-nums">
              {project.id}
            </div>
          </div>

          <header className="mb-10 border-b border-border pb-8">
            <ProjectActions projectId={project.id} initialName={project.name} />
            <dl className="mt-8 grid grid-cols-3 gap-8">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Reviews
                </dt>
                <dd className="mt-1 text-3xl font-semibold tabular-nums tracking-tight">
                  {reviews.length}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Blocks
                </dt>
                <dd className="mt-1 text-3xl font-semibold tabular-nums tracking-tight">
                  {blockCount}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Last submitted
                </dt>
                <dd className="mt-1 text-sm">
                  {lastReview ? (
                    <span className="tabular-nums">
                      {new Date(lastReview.submittedAt).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </dd>
              </div>
            </dl>
          </header>

          <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
            <section className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Reviews
              </h2>
              {reviews.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border bg-secondary/30 p-12 text-center">
                  <p className="text-pretty text-sm text-muted-foreground">
                    No reviews yet. Embed the snippet on the right and share your staging URL.
                  </p>
                </div>
              ) : (
                <ul role="list" className="divide-y divide-border rounded-lg border border-border bg-card">
                  {reviews.map((r) => {
                    const items = r.items as unknown as ReviewItem[];
                    return (
                      <li key={r.id} className="px-5 py-4 transition-colors hover:bg-secondary/40">
                        <div className="mb-3 flex items-baseline justify-between gap-4">
                          <span className="text-sm font-medium tabular-nums">
                            {new Date(r.submittedAt).toLocaleString(undefined, {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </span>
                          <span className="text-xs text-muted-foreground tabular-nums">
                            {items.length} {items.length === 1 ? "block" : "blocks"}
                          </span>
                        </div>
                        <ul role="list" className="space-y-2">
                          {items.map((item, idx) => (
                            <li key={`${r.id}-${idx}`} className="text-sm">
                              <div className="flex items-baseline gap-3">
                                <span className="font-medium">{item.block}</span>
                                <span className="text-muted-foreground">→</span>
                                <span>{item.variant}</span>
                              </div>
                              {item.comment && (
                                <p className="mt-1 text-pretty border-l-2 border-border pl-3 text-muted-foreground">
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
              )}
            </section>

            <aside className="space-y-6 lg:sticky lg:top-10 lg:self-start">
              <div className="space-y-3">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Embed
                </h2>
                <Snippets projectId={project.id} />
              </div>
            </aside>
          </div>
        </main>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────
         Option 3 — Consensus
         Horizontal stacked bars per block with vote counts, comments below.
         ───────────────────────────────────────────────────────────────────────── */}
      <div data-uidotsh-option="Consensus" className="contents" hidden>
        <main className="mx-auto max-w-4xl space-y-10 px-6 py-12">
          <div>
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              ← All projects
            </Link>
          </div>

          <header className="space-y-4">
            <ProjectActions projectId={project.id} initialName={project.name} />
            <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 text-sm text-muted-foreground tabular-nums">
              <span>
                <span className="font-medium text-foreground">{reviews.length}</span>{" "}
                {reviews.length === 1 ? "review" : "reviews"}
              </span>
              <span>•</span>
              <span>
                <span className="font-medium text-foreground">{blockCount}</span>{" "}
                {blockCount === 1 ? "block" : "blocks"}
              </span>
              {lastReview && (
                <>
                  <span>•</span>
                  <span>
                    last {new Date(lastReview.submittedAt).toLocaleDateString()}
                  </span>
                </>
              )}
            </div>
            <details className="group">
              <summary className="inline-flex cursor-pointer items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <span>Show install snippet</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                  className="transition-transform group-open:rotate-180"
                >
                  <path
                    d="M3.5 5.25C3.5 5.25 6.07769 8.74999 7 8.75C7.92237 8.75001 10.5 5.25 10.5 5.25"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </summary>
              <div className="mt-3">
                <Snippets projectId={project.id} />
              </div>
            </details>
          </header>

          {aggregates.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-12 text-center">
              <p className="text-pretty text-sm text-muted-foreground">
                No consensus yet. Once a client submits, blocks and votes appear here.
              </p>
            </div>
          ) : (
            <section className="space-y-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Consensus by block
              </h2>
              <ul role="list" className="space-y-6">
                {aggregates.map((agg) => (
                  <li
                    key={agg.block}
                    className="rounded-xl border border-border bg-card p-5"
                  >
                    <div className="mb-4 flex items-baseline justify-between gap-4">
                      <h3 className="text-lg font-medium tracking-tight">{agg.block}</h3>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {agg.total} {agg.total === 1 ? "vote" : "votes"}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {agg.variants.map((v, i) => (
                        <div key={v.name}>
                          <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
                            <span className={i === 0 ? "font-medium" : ""}>{v.name}</span>
                            <span className="text-muted-foreground tabular-nums">
                              {v.count} · {v.pct}%
                            </span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-secondary">
                            <div
                              className={`h-full rounded-full ${i === 0 ? "bg-primary" : "bg-muted-foreground/40"} w-(--w)`}
                              style={{ ["--w" as string]: `${v.pct}%` }}
                            />
                          </div>
                          {v.comments.length > 0 && (
                            <ul role="list" className="mt-2 space-y-1.5 pl-3">
                              {v.comments.slice(0, 3).map((c, ci) => (
                                <li
                                  key={ci}
                                  className="text-pretty border-l-2 border-border pl-3 text-sm text-muted-foreground"
                                >
                                  “{c.text}”
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </main>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────
         Option 4 — Activity Timeline
         Vertical timeline with circle markers; snippet behind an Install button.
         ───────────────────────────────────────────────────────────────────────── */}
      <div data-uidotsh-option="Activity Timeline" className="contents" hidden>
        <main className="mx-auto max-w-3xl px-6 py-12">
          <div className="mb-8 flex items-center justify-between">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              ← All projects
            </Link>
            <details className="relative">
              <summary className="cursor-pointer list-none rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-secondary">
                Install
              </summary>
              <div className="absolute right-0 top-full z-10 mt-2 w-[420px] rounded-lg border border-border bg-card p-4 shadow-lg">
                <Snippets projectId={project.id} />
              </div>
            </details>
          </div>

          <header className="mb-10 space-y-3">
            <ProjectActions projectId={project.id} initialName={project.name} />
            <p className="text-pretty text-sm text-muted-foreground tabular-nums">
              {reviews.length} {reviews.length === 1 ? "submission" : "submissions"}
              {lastReview && (
                <>
                  {" · last "}
                  {new Date(lastReview.submittedAt).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </>
              )}
            </p>
          </header>

          {reviews.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-12 text-center">
              <p className="text-pretty text-sm text-muted-foreground">
                Quiet so far. Activity will land here once a client picks variants and submits.
              </p>
            </div>
          ) : (
            <ol role="list" className="relative ml-3 space-y-8 border-l border-border pl-8">
              {reviews.map((r) => {
                const items = r.items as unknown as ReviewItem[];
                return (
                  <li key={r.id} className="relative">
                    <span
                      className="absolute -left-[35px] top-1.5 size-3 rounded-full border-2 border-background bg-primary"
                      aria-hidden="true"
                    />
                    <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground tabular-nums">
                      {new Date(r.submittedAt).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </div>
                    <div className="rounded-lg border border-border bg-card p-4">
                      <ul role="list" className="space-y-3">
                        {items.map((item, idx) => (
                          <li key={`${r.id}-${idx}`} className="text-sm">
                            <div className="flex items-baseline gap-2">
                              <span className="rounded bg-secondary px-1.5 py-0.5 text-xs font-medium">
                                {item.block}
                              </span>
                              <span className="text-muted-foreground">picked</span>
                              <span className="font-medium">{item.variant}</span>
                            </div>
                            {item.comment && (
                              <p className="mt-2 text-pretty leading-6 text-muted-foreground">
                                {item.comment}
                              </p>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </main>
      </div>
    </div>
  );
}
