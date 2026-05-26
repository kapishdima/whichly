"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@optio/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@optio/ui/components/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@optio/ui/components/field";
import { Input } from "@optio/ui/components/input";
import { Separator } from "@optio/ui/components/separator";
import { GithubIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const result = await authClient.signUp.email({ email, password, name });
    setSubmitting(false);
    if (result.error) {
      toast.error(result.error.message ?? "Sign-up failed");
      return;
    }
    router.push("/");
    router.refresh();
  }

  async function handleGithub() {
    await authClient.signIn.social({ provider: "github", callbackURL: "/" });
  }

  return (
    <main className="flex min-h-dvh items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-balance text-2xl tracking-tight">Create account</CardTitle>
          <CardDescription>Start collecting review feedback.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <Button type="button" variant="outline" onClick={handleGithub}>
            <GithubIcon data-icon="inline-start" />
            Continue with GitHub
          </Button>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <Separator className="flex-1" />
            or
            <Separator className="flex-1" />
          </div>

          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <FieldDescription>At least 8 characters.</FieldDescription>
              </Field>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Creating..." : "Create account"}
              </Button>
            </FieldGroup>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have one?{" "}
            <a href="/sign-in" className="font-medium text-foreground underline underline-offset-4">
              Sign in
            </a>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
