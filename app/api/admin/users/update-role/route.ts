// Update a user's role. Called by UserManagementTable.
// Accepts { userId, role } — delegates to the same logic as /api/admin/users/role
// but keyed on userId instead of email for direct table-row operations.
// Requires admin or super_admin.
import { NextRequest, NextResponse } from 'next/server';
import { apiRequireAdmin } from '@/lib/admin/guards';
import { getAdminClient } from '@/lib/supabase/admin';
import { applyRateLimit } from '@/lib/api/withRateLimit';
import { safeError, safeInternalError } from '@/lib/api/safe-error';
import { withApiAudit } from '@/lib/audit/withApiAudit';

export const runtime = 'nodejs';

const VALID_ROLES = [
  'student', 'staff', 'instructor', 'admin', 'super_admin',
  'program_holder', 'employer', 'partner', 'mentor',
];

async function _POST(request: NextRequest) {
  try {
    const rateLimited = await applyRateLimit(request, 'strict');
    if (rateLimited) return rateLimited;

    const auth = await apiRequireAdmin(request);
    if (auth.error) return auth.error;
    const { user, profile: actor } = auth;

    const { userId, role } = await request.json();
    if (!userId || !role) return safeError('userId and role are required', 400);

    if (!VALID_ROLES.includes(role)) {
      return safeError(`Invalid role. Must be one of: ${VALID_ROLES.join(', ')}`, 400);
    }

    // Only super_admin can promote to admin/super_admin
    if (['admin', 'super_admin'].includes(role) && actor?.role !== 'super_admin') {
      return safeError('Only super_admin can grant admin roles', 403);
    }

    const db = await getAdminClient();
    const { error } = await db
      .from('profiles')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) return safeInternalError(error, 'Failed to update role');

    return NextResponse.json({ success: true });
  } catch (err) {
    return safeInternalError(err as Error, 'update-role error');
  }
}

export const POST = withApiAudit('/api/admin/users/update-role', _POST);
