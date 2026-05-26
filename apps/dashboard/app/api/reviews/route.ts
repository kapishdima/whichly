import { prisma } from "@/lib/db";
import { CreateReviewSchema } from "@/lib/schemas/review";
import { NextResponse } from "next/server";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type",
};

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = CreateReviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400, headers: CORS_HEADERS });
  }

  const { projectId, items } = parsed.data;

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) {
    return NextResponse.json(
      { error: "Project not found" },
      { status: 404, headers: CORS_HEADERS },
    );
  }

  const review = await prisma.review.create({
    data: { projectId, items },
    select: { id: true, submittedAt: true },
  });

  return NextResponse.json({ review }, { status: 201, headers: CORS_HEADERS });
}
