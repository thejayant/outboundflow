import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { requireSupabaseConfiguration } from "@/lib/supabase/env";

export async function logActivity(input: {
  workspaceId: string;
  actorUserId?: string | null;
  action: string;
  targetType?: string | null;
  targetId?: string | null;
  metadata?: Record<string, unknown> | null;
}) {
  requireSupabaseConfiguration();

  const supabase = createAdminSupabaseClient();
  await supabase.from("activity_logs").insert({
    workspace_id: input.workspaceId,
    actor_user_id: input.actorUserId ?? null,
    action: input.action,
    target_type: input.targetType ?? null,
    target_id: input.targetId ?? null,
    metadata: input.metadata ?? null,
  });
}
