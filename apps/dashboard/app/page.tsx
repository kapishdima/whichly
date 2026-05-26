import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/session";
import Link from "next/link";
import { NewProjectForm } from "./_components/new-project-form";
import { SignOutButton } from "./_components/sign-out-button";

export default async function DashboardHome() {
  const session = await requireSession();
  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, createdAt: true, _count: { select: { reviews: true } } },
  });

  return (
    <main className="mx-auto max-w-3xl space-y-8 px-6 py-12">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground">
            Signed in as {session.user.email ?? session.user.name}
          </p>
        </div>
        <SignOutButton />
      </header>

      <NewProjectForm />

      {projects.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No projects yet. Create your first one above.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-border rounded-lg border border-border">
          {projects.map((p) => (
            <li key={p.id}>
              <Link
                href={`/projects/${p.id}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-secondary"
              >
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {p._count.reviews} {p._count.reviews === 1 ? "review" : "reviews"}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
