import { NextResponse } from "next/server";
import { getWorkspaceContext } from "@/lib/db/workspace";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { profileSchema } from "@/lib/zod/schemas";

export async function POST(request: Request) {
  const payload = profileSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ error: payload.error.flatten() }, { status: 400 });
  }

  const workspace = await getWorkspaceContext();
  const supabase = createAdminSupabaseClient();
  const profilesTable = supabase.from("profiles") as unknown as {
    upsert: (
      values: Record<string, unknown>,
    ) => Promise<{ error: { message: string } | null }>;
  };
  const { error } = await profilesTable.upsert({
    id: workspace.userId,
    full_name: payload.data.fullName,
    title: payload.data.title || null,
    primary_workspace_id: workspace.workspaceId,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
