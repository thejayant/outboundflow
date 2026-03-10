export const demoWorkspace = {
  id: "00000000-0000-0000-0000-000000000001",
  name: "OutboundFlow Demo",
  slug: "outboundflow-demo",
};

export const demoMetrics = {
  totalLeads: 248,
  queued: 41,
  sent: 112,
  followupSent: 48,
  replied: 27,
  unsubscribed: 6,
  failed: 4,
  replyRate: 16.8,
};

export const demoCampaignChart = [
  { name: "Founder warmup", replyRate: 19.2 },
  { name: "Agency outbound", replyRate: 14.7 },
  { name: "SMB design sprint", replyRate: 22.4 },
  { name: "Fintech v1", replyRate: 11.5 },
];

export const demoContacts = [
  {
    id: "10000000-0000-0000-0000-000000000001",
    email: "alina@northstar.dev",
    first_name: "Alina",
    last_name: "Reed",
    company: "Northstar",
    source: "xlsx",
    unsubscribed_at: null,
  },
  {
    id: "10000000-0000-0000-0000-000000000002",
    email: "mario@peakops.io",
    first_name: "Mario",
    last_name: "Sato",
    company: "PeakOps",
    source: "google_sheets",
    unsubscribed_at: null,
  },
];

export const demoCampaigns = [
  {
    id: "20000000-0000-0000-0000-000000000001",
    name: "Founder warmup",
    status: "active",
    daily_send_limit: 35,
    timezone: "Asia/Calcutta",
    queued: 16,
    replied: 9,
  },
  {
    id: "20000000-0000-0000-0000-000000000002",
    name: "Agency outbound",
    status: "paused",
    daily_send_limit: 20,
    timezone: "America/New_York",
    queued: 8,
    replied: 4,
  },
];

export const demoThreads = [
  {
    id: "30000000-0000-0000-0000-000000000001",
    subject: "Quick intro",
    snippet: "This looks relevant for our team. Can you share pricing?",
    latest_message_at: new Date().toISOString(),
    messages: [
      {
        id: "40000000-0000-0000-0000-000000000001",
        direction: "outbound",
        from_email: "sales@outboundflow.dev",
        to_emails: ["alina@northstar.dev"],
        subject: "Quick intro",
        body_text: "Hi Alina, noticed Northstar is scaling outbound...",
        sent_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      },
      {
        id: "40000000-0000-0000-0000-000000000002",
        direction: "inbound",
        from_email: "alina@northstar.dev",
        to_emails: ["sales@outboundflow.dev"],
        subject: "Re: Quick intro",
        body_text: "This looks relevant for our team. Can you share pricing?",
        sent_at: new Date().toISOString(),
      },
    ],
  },
];
