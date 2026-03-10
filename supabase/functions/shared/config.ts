export const config = {
  supabaseUrl: Deno.env.get("SUPABASE_URL") ?? "",
  supabaseServiceRoleKey: Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  tokenEncryptionKey: Deno.env.get("TOKEN_ENCRYPTION_KEY") ?? "",
  cronVerifySecret: Deno.env.get("SUPABASE_CRON_VERIFY_SECRET") ?? "",
  googleClientId: Deno.env.get("GOOGLE_CLIENT_ID") ?? "",
  googleClientSecret: Deno.env.get("GOOGLE_CLIENT_SECRET") ?? "",
  followUpDelayDays: Number(Deno.env.get("FOLLOW_UP_DELAY_DAYS") ?? "2"),
  defaultPerMinuteThrottle: Number(Deno.env.get("DEFAULT_PER_MINUTE_THROTTLE") ?? "10"),
};
