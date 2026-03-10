-- Optional local development seed.
-- Replace the user IDs below with auth user IDs created in your local Supabase instance if needed.

insert into public.workspaces (id, name, slug)
values ('00000000-0000-0000-0000-000000000001', 'OutboundFlow Demo', 'outboundflow-demo')
on conflict (id) do nothing;

insert into public.profiles (id, full_name, title, primary_workspace_id)
values (
  '00000000-0000-0000-0000-000000000100',
  'Demo Operator',
  'Growth operator',
  '00000000-0000-0000-0000-000000000001'
)
on conflict (id) do nothing;

insert into public.workspace_members (workspace_id, user_id, role)
values (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000100',
  'owner'
)
on conflict (workspace_id, user_id) do nothing;

insert into public.workspace_usage_counters (workspace_id, daily_sends_used, active_campaigns_count, connected_mailboxes_count, seats_used)
values ('00000000-0000-0000-0000-000000000001', 12, 2, 1, 1)
on conflict (workspace_id, period_start) do nothing;

insert into public.contacts (
  id, workspace_id, owner_user_id, email, first_name, last_name, company, website, job_title, source, custom_fields_jsonb
)
values
  (
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000100',
    'alina@northstar.dev',
    'Alina',
    'Reed',
    'Northstar',
    'https://northstar.dev',
    'CEO',
    'xlsx',
    '{"industry":"SaaS"}'::jsonb
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000100',
    'mario@peakops.io',
    'Mario',
    'Sato',
    'PeakOps',
    'https://peakops.io',
    'Ops Lead',
    'google_sheets',
    '{"region":"US"}'::jsonb
  )
on conflict do nothing;

insert into public.contact_lists (id, workspace_id, owner_user_id, name, description)
values (
  '11000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000100',
  'Warm prospects',
  'Demo list for campaign launch flow'
)
on conflict do nothing;

insert into public.contact_list_members (contact_list_id, contact_id)
values
  ('11000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001'),
  ('11000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002')
on conflict do nothing;

insert into public.templates (id, workspace_id, owner_user_id, name, subject_template, body_template)
values (
  '70000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000100',
  'Founder intro',
  'Quick idea for {{company}}',
  'Hi {{first_name}},\n\nNoticed {{company}} and wanted to share a short idea.\n\nBest,\nDemo Operator'
)
on conflict do nothing;

insert into public.oauth_connections (
  id, workspace_id, user_id, provider, email_address, access_token_encrypted, refresh_token_encrypted, status
)
values (
  '50000000-0000-0000-0000-000000000010',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000100',
  'gmail',
  'sales@outboundflow.dev',
  'demo.encrypted.access',
  'demo.encrypted.refresh',
  'active'
)
on conflict do nothing;

insert into public.gmail_accounts (
  id, workspace_id, user_id, oauth_connection_id, email_address, status, health_status, daily_send_count
)
values (
  '50000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000100',
  '50000000-0000-0000-0000-000000000010',
  'sales@outboundflow.dev',
  'active',
  'active',
  12
)
on conflict do nothing;

insert into public.campaigns (
  id, workspace_id, owner_user_id, name, status, gmail_account_id, daily_send_limit, send_window_start, send_window_end, timezone
)
values (
  '20000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000100',
  'Founder warmup',
  'active',
  '50000000-0000-0000-0000-000000000001',
  35,
  '09:00',
  '17:00',
  'Asia/Calcutta'
)
on conflict do nothing;

insert into public.campaign_steps (campaign_id, step_number, step_type, subject_template, body_template, wait_days)
values
  (
    '20000000-0000-0000-0000-000000000001',
    1,
    'initial',
    'Quick idea for {{company}}',
    'Hi {{first_name}},\n\nThought this might be useful for {{company}}.',
    0
  ),
  (
    '20000000-0000-0000-0000-000000000001',
    2,
    'follow_up',
    'Following up on my note',
    'Hi {{first_name}},\n\nFollowing up in case this got buried.',
    2
  )
on conflict do nothing;

insert into public.campaign_contacts (
  id, campaign_id, contact_id, status, current_step, next_due_at, failed_attempts
)
values
  (
    '80000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'queued',
    1,
    timezone('utc', now()),
    0
  ),
  (
    '80000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000002',
    'replied',
    2,
    null,
    0
  )
on conflict do nothing;
