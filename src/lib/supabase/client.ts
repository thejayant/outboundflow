"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/db/database.types";
import { env } from "@/lib/supabase/env";

let clientSingleton: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createClient() {
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Supabase browser env is not configured.");
  }

  if (!clientSingleton) {
    clientSingleton = createBrowserClient<Database>(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    );
  }

  return clientSingleton as unknown as ReturnType<typeof createBrowserClient<Database>>;
}
