/** @deprecated Use '@/lib/supabase/admin' instead. */
import { getAdminClient } from '@/lib/supabase/admin';
import type { SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient<any> | null = null;

/**
 * @deprecated Use await getAdminClient() from '@/lib/supabase/admin' instead.
 * Async getter replaces the old Proxy shim which used await in a non-async
 * get trap — illegal syntax that Turbopack refuses to parse.
 */
export async function getSupabaseAdmin(): Promise<SupabaseClient<any>> {
  if (!_client) _client = await getAdminClient();
  return _client;
}

// Re-export for any callers that destructure { supabaseAdmin } — points them
// to the canonical helper so they get a compile error rather than a runtime crash.
export { getAdminClient as supabaseAdmin };
