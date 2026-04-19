/** @deprecated Use '@/lib/supabase/admin' instead. */
import { getAdminClient } from '@/lib/supabase/admin';
import type { SupabaseClient } from '@supabase/supabase-js';

/** @deprecated Use await getAdminClient() from '@/lib/supabase/admin' instead. */
export async function getDeprecatedSupabaseAdminClient(): Promise<SupabaseClient<any>> {
  return getAdminClient();
}

/** @deprecated Use await getAdminClient() from '@/lib/supabase/admin' instead. */
export const supabaseAdmin: SupabaseClient<any> = new Proxy({} as SupabaseClient<any>, {
  get() {
    throw new Error(
      "Deprecated sync 'supabaseAdmin' was accessed. Use 'await getAdminClient()' from '@/lib/supabase/admin'."
    );
  },
});
