import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { customCrmPayloadSchema } from "@/lib/zod/schemas";
import { env, requireSupabaseConfiguration } from "@/lib/supabase/env";

function getApiKeyWorkspaceMap() {
  return (env.CUSTOM_CRM_API_KEYS ?? "")
    .split(",")
    .filter(Boolean)
    .map((entry) => {
      const [workspaceId, key] = entry.split(":");
      return { workspaceId, key };
    });
}

export async function POST(request: Request) {
  requireSupabaseConfiguration();
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace(/^Bearer\s+/i, "") ?? "";
  const payload = customCrmPayloadSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ error: payload.error.flatten() }, { status: 400 });
  }

  const workspaceAuth = getApiKeyWorkspaceMap().find(
    (item) => item.key === token && item.workspaceId === payload.data.workspaceId,
  );

  if (!workspaceAuth) {
    return NextResponse.json({ error: "Invalid workspace API key" }, { status: 401 });
  }

  const supabase = createAdminSupabaseClient();
  const contactsTable = supabase.from("contacts") as unknown as {
    upsert: (
      values: Array<Record<string, unknown>>,
      options: { onConflict: string },
    ) => Promise<{ error: { message: string } | null }>;
  };
  const { error } = await contactsTable.upsert(
    payload.data.contacts.map((contact) => ({
      workspace_id: payload.data.workspaceId,
      owner_user_id: payload.data.workspaceId,
      external_source: payload.data.externalSource,
      external_contact_id: contact.externalContactId,
      email: contact.email,
      first_name: contact.firstName ?? null,
      last_name: contact.lastName ?? null,
      company: contact.company ?? null,
      website: contact.website ?? null,
      job_title: contact.jobTitle ?? null,
      custom_fields_jsonb: contact.customFields ?? {},
      source: "custom_crm",
    })),
    {
      onConflict: "workspace_id,external_source,external_contact_id",
    },
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ imported: payload.data.contacts.length });
}
