import { cn } from "@optio/ui/lib/utils";

export default function DashboardHome() {
  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className={cn("max-w-xl space-y-4 text-center")}>
        <h1 className="text-4xl font-semibold tracking-tight">Optio Dashboard</h1>
        <p className="text-muted-foreground text-lg">Sign-in and project workspace coming soon.</p>
      </div>
    </main>
  );
}
