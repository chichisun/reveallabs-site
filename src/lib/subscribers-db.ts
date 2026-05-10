// src/lib/subscribers-db.ts — service-role Supabase client for the subscribers
// table. Writes only happen server-side (in /api/news/subscribe and
// /api/news/confirm), never from the browser.
//
// The `subscribers` table is RLS-locked to service-role per
// marketing/supabase/migrations/0004_subscribers_drop_log_email_sends.sql.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let cachedClient: SupabaseClient | null = null;

export function subscribersDb(): SupabaseClient {
  if (!url || !serviceRoleKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set — required for subscribers writes",
    );
  }
  if (!cachedClient) {
    cachedClient = createClient(url, serviceRoleKey, {
      auth: { persistSession: false },
    });
  }
  return cachedClient;
}

export type SubscriberStatus = "pending" | "confirmed" | "unsubscribed";

export interface Subscriber {
  id: string;
  email: string;
  status: SubscriberStatus;
  confirmation_token: string;
  confirmation_token_expires_at: string;
  confirmed_at: string | null;
  unsubscribed_at: string | null;
  resend_contact_id: string | null;
  source: string | null;
  created_at: string;
  updated_at: string;
}
