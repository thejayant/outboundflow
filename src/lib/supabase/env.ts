import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  DATABASE_URL: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_OAUTH_REDIRECT_URI: z.string().optional(),
  TOKEN_ENCRYPTION_KEY: z.string().min(32).optional(),
  CUSTOM_CRM_API_KEYS: z.string().optional(),
  DEFAULT_PER_USER_DAILY_CAP: z.coerce.number().default(50),
  DEFAULT_PER_MINUTE_THROTTLE: z.coerce.number().default(10),
  FOLLOW_UP_DELAY_DAYS: z.coerce.number().default(2),
  SUPABASE_CRON_VERIFY_SECRET: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

export const env = parsed.success
  ? parsed.data
  : {
      DEFAULT_PER_USER_DAILY_CAP: 50,
      DEFAULT_PER_MINUTE_THROTTLE: 10,
      FOLLOW_UP_DELAY_DAYS: 2,
    };

export const isSupabaseConfigured = Boolean(
  env.NEXT_PUBLIC_SUPABASE_URL &&
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    env.SUPABASE_SERVICE_ROLE_KEY,
);

export const isGoogleConfigured = Boolean(
  env.GOOGLE_CLIENT_ID &&
    env.GOOGLE_CLIENT_SECRET &&
    env.GOOGLE_OAUTH_REDIRECT_URI &&
    env.TOKEN_ENCRYPTION_KEY,
);

export function requireSupabaseConfiguration() {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
}

export function requireGoogleConfiguration() {
  if (!isGoogleConfigured) {
    throw new Error(
      "Google OAuth is not configured. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_OAUTH_REDIRECT_URI, and TOKEN_ENCRYPTION_KEY.",
    );
  }
}
