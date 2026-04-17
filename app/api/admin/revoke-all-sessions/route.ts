import { NextRequest, NextResponse } from 'next/server';
import { apiRequireAdmin } from '@/lib/admin/guards';
import { getAdminClient } from '@/lib/supabase/admin';
import { applyRateLimit } from '@/lib/api/withRateLimit';
import { safeError, safeInternalError } from '@/lib/api/safe-error';
import { withApiAudit } from '@/lib/audit/withApiAudit';

export const dynamic = 'force-dynamic';

async function _POST(request: NextRequest) {
  try {
    const rateLimited = await applyRateLimit(request, 'strict');
    if (rateLimited) return rateLimited;

    const auth = await apiRequireAdmin(request);
    if (auth.error) return auth.error;

    const { userId } = await request.json();
    if (!userId) return safeError('userId required', 400);

    // auth.admin.signOut requires the service-role key — createClient() uses
    // the anon key and does not have permission to call this method.
    const admin = await getAdminClient();
    const { error: signOutError } = await admin.auth.admin.signOut(userId);

    if (signOutError) return safeInternalError(signOutError, 'Failed to revoke sessions');

    return NextResponse.json({
      success: true,
      message: `All sessions revoked for user ${userId}`,
    });
  } catch (error) {
    return safeInternalError(error as Error, 'Internal server error');
  }
}

export const POST = withApiAudit('/api/admin/revoke-all-sessions', _POST);
