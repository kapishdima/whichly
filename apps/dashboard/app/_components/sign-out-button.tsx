"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();
  async function handle() {
    await authClient.signOut();
    router.push("/sign-in");
    router.refresh();
  }
  return (
    <button
      type="button"
      onClick={handle}
      className="text-sm text-muted-foreground hover:text-foreground"
    >
      Sign out
    </button>
  );
}
