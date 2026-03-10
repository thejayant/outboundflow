import { AppShell } from "@/components/layout/app-shell";
import { requireSessionUser } from "@/lib/auth/session";
import { requireSupabaseConfiguration } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export default async function ProtectedAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  requireSupabaseConfiguration();
  await requireSessionUser();

  return <AppShell>{children}</AppShell>;
}
