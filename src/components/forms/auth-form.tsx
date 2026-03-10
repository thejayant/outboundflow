"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { authSchema, emailOnlySchema } from "@/lib/zod/schemas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthMode = "sign-in" | "sign-up" | "forgot-password";

export function AuthForm({ mode }: { mode: AuthMode }) {
  const [isPending, startTransition] = useTransition();
  const schema = mode === "forgot-password" ? emailOnlySchema : authSchema;
  const form = useForm<z.infer<typeof emailOnlySchema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      try {
        const supabase = createClient();

        if (mode === "sign-in") {
          const { error } = await supabase.auth.signInWithPassword({
            email: values.email,
            password: values.password ?? "",
          });
          if (error) throw error;
          window.location.href = "/dashboard";
          return;
        }

        if (mode === "sign-up") {
          const { error } = await supabase.auth.signUp({
            email: values.email,
            password: values.password ?? "",
            options: {
              emailRedirectTo: `${window.location.origin}/callback`,
            },
          });
          if (error) throw error;
          toast.success("Check your email for the confirmation link.");
          return;
        }

        const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
          redirectTo: `${window.location.origin}/callback`,
        });
        if (error) throw error;
        toast.success("Password reset email sent.");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Request failed";
        toast.error(message);
      }
    });
  });

  const title =
    mode === "sign-in"
      ? "Sign in"
      : mode === "sign-up"
        ? "Create account"
        : "Reset password";

  return (
    <Card className="w-full max-w-md border-border/60 bg-card/90 card-shadow">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={onSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...form.register("email")} />
          </div>
          {mode !== "forgot-password" ? (
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...form.register("password")} />
            </div>
          ) : null}
          <Button type="submit" disabled={isPending}>
            {isPending ? "Working..." : title}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
