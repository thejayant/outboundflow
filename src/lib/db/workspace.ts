import { cache } from "react";
import { getSessionUser } from "@/lib/auth/session";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { requireSupabaseConfiguration } from "@/lib/supabase/env";

export type WorkspaceContext = {
  userId: string;
  workspaceId: string;
  workspaceName: string;
};

export const getWorkspaceContext = cache(async (): Promise<WorkspaceContext> => {
  requireSupabaseConfiguration();
  const user = await getSessionUser();

  if (!user) {
    throw new Error("No authenticated user session.");
  }

  const supabase = createAdminSupabaseClient();
  const { data: rawMembership } = await supabase
    .from("workspace_members")
    .select("workspace_id, workspaces(name)")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();
  const data = rawMembership as
    | { workspace_id: string; workspaces?: { name?: string } | null }
    | null;

  if (!data) {
    throw new Error("No workspace membership found for the authenticated user.");
  }

  return {
    userId: user.id,
    workspaceId: data.workspace_id,
    workspaceName:
      ((data.workspaces as { name?: string } | null)?.name as string | undefined) ??
      "Workspace",
  };
});
