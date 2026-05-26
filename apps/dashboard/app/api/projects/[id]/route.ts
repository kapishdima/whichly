import { prisma } from "@/lib/db";
import { UpdateProjectSchema } from "@/lib/schemas/project";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

interface Params {
  params: Promise<{ id: string }>;
}

async function loadOwned(projectId: string, userId: string) {
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId },
  });
  return project;
}

export async function GET(_request: Request, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const project = await loadOwned(id, session.user.id);
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const reviews = await prisma.review.findMany({
    where: { projectId: id },
    orderBy: { submittedAt: "desc" },
    take: 100,
  });

  return NextResponse.json({ project, reviews });
}

export async function PATCH(request: Request, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const project = await loadOwned(id, session.user.id);
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await request.json().catch(() => null);
  const parsed = UpdateProjectSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const updated = await prisma.project.update({
    where: { id },
    data: { name: parsed.data.name },
    select: { id: true, name: true, createdAt: true },
  });

  return NextResponse.json({ project: updated });
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const project = await loadOwned(id, session.user.id);
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
