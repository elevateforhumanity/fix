import { NextRequest, NextResponse } from 'next/server';
import { apiRequireAdmin } from '@/lib/admin/guards';
import { getAdminClient } from '@/lib/supabase/admin';
import { safeError, safeInternalError } from '@/lib/api/safe-error';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const auth = await apiRequireAdmin(req);
  if (auth.error) return auth.error;

  const db = await getAdminClient();
  if (!db) return safeError('Database unavailable', 503);

  const { error } = await db
    .from('integration_tokens')
    .delete()
    .eq('user_id', auth.id)
    .eq('provider', 'google_classroom');

  if (error) return safeInternalError(error, 'Failed to disconnect');

  return NextResponse.json({ ok: true });
}
