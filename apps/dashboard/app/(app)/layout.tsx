import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/session";
import { SidebarInset, SidebarProvider } from "@optio/ui/components/sidebar";
import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { AppSidebar } from "./_components/app-sidebar";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await requireSession();
  const cookieStore = await cookies();
  const sidebarState = cookieStore.get("sidebar_state")?.value;
  const defaultOpen = sidebarState !== "false";

  const firstProject = await prisma.project.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true },
  });
  const hasProject = !!firstProject;
  const hasReview = hasProject
    ? (await prisma.review.count({
        where: { project: { userId: session.user.id } },
      })) > 0
    : false;

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      {/* <AppSidebar
        user={{ name: session.user.name, email: session.user.email }}
        onboarding={{ hasProject, hasReview, firstProjectId: firstProject?.id }}
      /> */}
      <SidebarInset className="isolate">{children}</SidebarInset>
    </SidebarProvider>
  );
}
