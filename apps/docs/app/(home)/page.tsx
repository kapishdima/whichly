import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-4xl font-semibold tracking-tight">Optio Docs</h1>
      <p className="text-fd-muted-foreground">
        Read the{" "}
        <Link className="underline" href="/docs">
          documentation
        </Link>{" "}
        to get started.
      </p>
    </main>
  );
}
