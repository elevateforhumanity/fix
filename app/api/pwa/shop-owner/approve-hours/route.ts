import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { applyRateLimit } from '@/lib/api/withRateLimit';
import { withApiAudit } from '@/lib/audit/withApiAudit';
import { logger } from '@/lib/logger';
import { safeError } from '@/lib/api/safe-error';
import { z } from 'zod';

const bodySchema = z.object({
  entryId: z.string().uuid(),
  action: z.enum(['approve', 'reject']),
  reason: z.string().optional(),
});

async function _POST(request: NextRequest) {
  try {
    const rateLimited = await applyRateLimit(request, 'api');
    if (rateLimited) return rateLimited;

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return safeError('Invalid request body', 400);
    }
    const { entryId, action, reason } = parsed.data;

    const db = await getAdminClient();

    // Resolve shop owned by this user — ensures they can only approve their own shop's hours
    const { data: shop } = await db
      .from('shops')
      .select('id')
      .eq('owner_id', user.id)
      .eq('active', true)
      .maybeSingle();

    if (!shop) {
      return safeError('No shop found for this account', 404);
    }

    // Verify the hour entry belongs to this shop
    const { data: entry } = await db
      .from('apprentice_hours')
      .select('id, shop_id, status')
      .eq('id', entryId)
      .maybeSingle();

    if (!entry) {
      return safeError('Hour entry not found', 404);
    }
    if (entry.shop_id !== shop.id) {
      return safeError('Not authorized to review this entry', 403);
    }
    if (entry.status !== 'pending') {
      return safeError('Entry has already been reviewed', 409);
    }

    const update: Record<string, any> = {
      status: action === 'approve' ? 'approved' : 'rejected',
      updated_at: new Date().toISOString(),
    };
    if (action === 'reject' && reason) {
      update.rejection_reason = reason;
    }

    const { error: updateError } = await db
      .from('apprentice_hours')
      .update(update)
      .eq('id', entryId);

    if (updateError) {
      logger.error('[approve-hours] DB update error', updateError);
      return safeError('Failed to update hour entry', 500);
    }

    return NextResponse.json({ success: true, action });
  } catch (err) {
    logger.error('[approve-hours] Unexpected error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const POST = withApiAudit('/api/pwa/shop-owner/approve-hours', _POST);
