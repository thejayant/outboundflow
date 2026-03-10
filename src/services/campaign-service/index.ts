import { addDays } from "date-fns";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { env, requireSupabaseConfiguration } from "@/lib/supabase/env";
import { renderTemplate } from "@/lib/utils/template";
import { isWithinSendWindow } from "@/lib/utils/time";

export async function listTemplates(workspaceId: string) {
  requireSupabaseConfiguration();

  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("templates")
    .select("id, name, subject_template, body_template, created_at")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data as Array<{
    id: string;
    name: string;
    subject_template: string;
    body_template: string;
    created_at: string;
  }>;
}

export async function saveTemplate(input: {
  workspaceId: string;
  userId: string;
  name: string;
  subjectTemplate: string;
  bodyTemplate: string;
}) {
  requireSupabaseConfiguration();

  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("templates")
    .insert({
      workspace_id: input.workspaceId,
      owner_user_id: input.userId,
      name: input.name,
      subject_template: input.subjectTemplate,
      body_template: input.bodyTemplate,
    })
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  return data as { id: string };
}

export async function listCampaigns(workspaceId: string) {
  requireSupabaseConfiguration();

  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("campaigns")
    .select("id, name, status, daily_send_limit, timezone, created_at")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data as Array<{
    id: string;
    name: string;
    status: string;
    daily_send_limit: number;
    timezone: string;
    created_at: string;
  }>;
}

export async function getCampaignById(campaignId: string) {
  requireSupabaseConfiguration();

  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("campaigns")
    .select(
      "id, name, status, daily_send_limit, timezone, send_window_start, send_window_end, campaign_contacts(id, status, current_step, next_due_at, contact:contacts(email, first_name, company))",
    )
    .eq("id", campaignId)
    .single();

  if (error) {
    throw error;
  }

  return data as {
    id: string;
    name: string;
    status: string;
    daily_send_limit: number;
    timezone: string;
    send_window_start?: string | null;
    send_window_end?: string | null;
    campaign_contacts?: Array<{
      id: string;
      status: string;
      current_step: number;
      next_due_at: string | null;
      contact?: { email?: string | null; first_name?: string | null; company?: string | null } | null;
    }>;
  };
}

export async function createCampaign(input: {
  workspaceId: string;
  userId: string;
  campaignName: string;
  gmailAccountId: string;
  targetContactIds: string[];
  timezone: string;
  sendWindowStart: string;
  sendWindowEnd: string;
  dailySendLimit: number;
  primarySubject: string;
  primaryBody: string;
  followupSubject: string;
  followupBody: string;
}) {
  requireSupabaseConfiguration();

  const supabase = createAdminSupabaseClient();
  const { data: rawCampaign, error } = await supabase
    .from("campaigns")
    .insert({
      workspace_id: input.workspaceId,
      owner_user_id: input.userId,
      name: input.campaignName,
      status: "active",
      gmail_account_id: input.gmailAccountId,
      daily_send_limit: input.dailySendLimit,
      send_window_start: input.sendWindowStart,
      send_window_end: input.sendWindowEnd,
      timezone: input.timezone,
      allowed_send_days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    })
    .select("id")
    .single();

  if (error) {
    throw error;
  }
  const campaign = rawCampaign as { id: string };

  await supabase.from("campaign_steps").insert([
    {
      campaign_id: campaign.id,
      step_number: 1,
      step_type: "initial",
      subject_template: input.primarySubject,
      body_template: input.primaryBody,
      wait_days: 0,
    },
    {
      campaign_id: campaign.id,
      step_number: 2,
      step_type: "follow_up",
      subject_template: input.followupSubject,
      body_template: input.followupBody,
      wait_days: env.FOLLOW_UP_DELAY_DAYS,
    },
  ]);

  await supabase.from("campaign_contacts").insert(
    input.targetContactIds.map((contactId) => ({
      campaign_id: campaign.id,
      contact_id: contactId,
      status: "queued",
      current_step: 1,
      next_due_at: new Date().toISOString(),
      failed_attempts: 0,
    })),
  );

  return { id: campaign.id, launched: true };
}

export async function pauseCampaign(campaignId: string, status: "paused" | "active") {
  requireSupabaseConfiguration();

  const supabase = createAdminSupabaseClient();
  await supabase.from("campaigns").update({ status }).eq("id", campaignId);
  return { campaignId, status };
}

export async function markFailedContactForResend(campaignContactId: string) {
  requireSupabaseConfiguration();

  const supabase = createAdminSupabaseClient();
  await supabase
    .from("campaign_contacts")
    .update({
      status: "queued",
      next_due_at: new Date().toISOString(),
      error_message: null,
    })
    .eq("id", campaignContactId);

  return { campaignContactId, status: "queued" };
}

export function previewRenderedTemplate(input: {
  subjectTemplate: string;
  bodyTemplate: string;
  contact: { first_name?: string | null; company?: string | null; website?: string | null };
}) {
  return {
    subject: renderTemplate(input.subjectTemplate, input.contact),
    body: renderTemplate(input.bodyTemplate, input.contact),
  };
}

export function scheduleFollowup(sentAt: string) {
  return addDays(new Date(sentAt), env.FOLLOW_UP_DELAY_DAYS).toISOString();
}

export function canSendNow(timezone: string, sendWindowStart: string, sendWindowEnd: string) {
  return isWithinSendWindow(new Date(), timezone, sendWindowStart, sendWindowEnd);
}
