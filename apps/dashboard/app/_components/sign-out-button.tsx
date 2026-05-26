"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@optio/ui/components/button";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();
  async function handle() {
    await authClient.signOut();
    router.push("/sign-in");
    router.refresh();
  }
  return (
    <Button type="button" variant="ghost" size="sm" onClick={handle}>
      <LogOutIcon data-icon="inline-start" />
      Sign out
    </Button>
  );
}
