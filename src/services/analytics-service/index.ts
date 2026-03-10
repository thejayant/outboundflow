import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { requireSupabaseConfiguration } from "@/lib/supabase/env";

export async function getDashboardMetrics(workspaceId: string) {
  requireSupabaseConfiguration();

  const supabase = createAdminSupabaseClient();
  const [
    { count: totalLeads },
    { count: queued },
    { count: sent },
    { count: followupSent },
    { count: replied },
    { count: unsubscribed },
    { count: failed },
  ] = await Promise.all([
    supabase.from("contacts").select("*", { count: "exact", head: true }).eq("workspace_id", workspaceId),
    supabase
      .from("campaign_contacts")
      .select("*", { count: "exact", head: true })
      .eq("status", "queued"),
    supabase
      .from("campaign_contacts")
      .select("*", { count: "exact", head: true })
      .eq("status", "sent"),
    supabase
      .from("campaign_contacts")
      .select("*", { count: "exact", head: true })
      .eq("status", "followup_sent"),
    supabase
      .from("campaign_contacts")
      .select("*", { count: "exact", head: true })
      .eq("status", "replied"),
    supabase
      .from("contacts")
      .select("*", { count: "exact", head: true })
      .not("unsubscribed_at", "is", null),
    supabase
      .from("campaign_contacts")
      .select("*", { count: "exact", head: true })
      .eq("status", "failed"),
  ]);

  const sentCount = sent ?? 0;
  const repliedCount = replied ?? 0;

  return {
    totalLeads: totalLeads ?? 0,
    queued: queued ?? 0,
    sent: sentCount,
    followupSent: followupSent ?? 0,
    replied: repliedCount,
    unsubscribed: unsubscribed ?? 0,
    failed: failed ?? 0,
    replyRate: sentCount ? Number(((repliedCount / sentCount) * 100).toFixed(1)) : 0,
  };
}

export async function getReplyRateByCampaign(workspaceId: string) {
  requireSupabaseConfiguration();

  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("campaigns")
    .select("id, name, campaign_contacts(status)")
    .eq("workspace_id", workspaceId);

  if (error) {
    throw error;
  }

  return ((data ?? []) as Array<{ name: string; campaign_contacts: Array<{ status: string }> | null }>).map((campaign) => {
    const contacts = (campaign.campaign_contacts as Array<{ status: string }> | null) ?? [];
    const sent = contacts.filter((contact) =>
      ["sent", "followup_sent", "replied"].includes(contact.status),
    ).length;
    const replied = contacts.filter((contact) => contact.status === "replied").length;

    return {
      name: campaign.name,
      replyRate: sent ? Number(((replied / sent) * 100).toFixed(1)) : 0,
    };
  });
}

export async function listThreads(workspaceId: string) {
  requireSupabaseConfiguration();

  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("message_threads")
    .select(
      "id, gmail_thread_id, subject, snippet, latest_message_at, thread_messages(id, direction, from_email, to_emails, subject, body_text, sent_at)",
    )
    .eq("workspace_id", workspaceId)
    .order("latest_message_at", { ascending: false })
    .limit(20);

  if (error) {
    throw error;
  }

  return ((data ?? []) as Array<{
    id: string;
    subject: string | null;
    snippet: string | null;
    latest_message_at: string | null;
    thread_messages: Array<{
      id: string;
      direction: string;
      from_email: string | null;
      to_emails: string[] | null;
      subject: string | null;
      body_text: string | null;
      sent_at: string;
    }> | null;
  }>).map((thread) => ({
    id: thread.id,
    subject: thread.subject,
    snippet: thread.snippet,
    latest_message_at: thread.latest_message_at,
    messages:
      ((thread.thread_messages as Array<{
        id: string;
        direction: string;
        from_email: string | null;
        to_emails: string[] | null;
        subject: string | null;
        body_text: string | null;
        sent_at: string;
      }> | null) ?? []) || [],
  }));
}
