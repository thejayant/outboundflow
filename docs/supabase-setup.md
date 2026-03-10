# Supabase Setup

## Project services used

- Auth
- Postgres
- Storage
- Edge Functions
- Cron

## Apply schema

Run the migration in:

- [supabase/migrations/20260310235900_init_outboundflow.sql](/D:/Jayant/AI_Jayant/Cold%20Email/supabase/migrations/20260310235900_init_outboundflow.sql)

## Seed data

Optional local seed file:

- [supabase/seed.sql](/D:/Jayant/AI_Jayant/Cold%20Email/supabase/seed.sql)

If you use the seed, either:

- replace the placeholder user UUID with a real auth user ID, or
- let the UI run in demo mode without a configured Supabase project

## Storage

Expected bucket:

- `imports`

It stores uploaded CSV/XLSX files before normalization.

## Edge Functions

Deploy:

- `supabase/functions/send-due-messages`
- `supabase/functions/sync-replies`

Required secrets:

- `SUPABASE_SERVICE_ROLE_KEY`
- `TOKEN_ENCRYPTION_KEY`
- `SUPABASE_CRON_VERIFY_SECRET`
- Gmail OAuth secrets

## Cron schedule

- Every 5 minutes: `send-due-messages`
- Every 5 minutes: `sync-replies`

Pass `x-cron-secret: <SUPABASE_CRON_VERIFY_SECRET>` in the scheduled invocation.

## RLS

RLS is enabled across workspace tables. App users access only workspace-scoped data unless they are admins/owners. Sensitive OAuth rows are intentionally not readable from client sessions.
