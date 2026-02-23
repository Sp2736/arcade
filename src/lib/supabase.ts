import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Ensure variables exist
if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables in .env.local");
}

/**
 * Returns a Supabase client with Admin/Service Role privileges.
 * WARNING: NEVER use this on the client-side (frontend). Only use in API routes.
 */
export const getServiceSupabase = () => {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};