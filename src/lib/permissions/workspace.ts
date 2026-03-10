import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function assertWorkspaceMember(workspaceId: string, userId: string) {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("workspace_members")
    .select("id, role")
    .eq("workspace_id", workspaceId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) {
    throw new Error("Workspace access denied.");
  }

  return data;
}
