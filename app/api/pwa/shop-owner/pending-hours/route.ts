import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { applyRateLimit } from '@/lib/api/withRateLimit';
import { withApiAudit } from '@/lib/audit/withApiAudit';
import { logger } from '@/lib/logger';

// PUBLIC ROUTE: No — requires auth. Shop owner sees pending hours for their shop only.

async function _GET(request: NextRequest) {
  try {
    const rateLimited = await applyRateLimit(request, 'api');
    if (rateLimited) return rateLimited;

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getAdminClient();

    // Resolve shop owned by this user
    const { data: shop } = await db
      .from('shops')
      .select('id, name')
      .eq('owner_id', user.id)
      .eq('active', true)
      .maybeSingle();

    if (!shop) {
      return NextResponse.json({ error: 'No shop found for this account' }, { status: 404 });
    }

    // Fetch pending apprentice_hours for this shop, join profile for name
    const { data: hours, error } = await db
      .from('apprentice_hours')
      .select('id, user_id, date, hours, minutes, category, notes, status, submitted_at')
      .eq('shop_id', shop.id)
      .eq('status', 'pending')
      .order('submitted_at', { ascending: false });

    if (error) {
      logger.error('[pending-hours] DB error', error);
      return NextResponse.json({ error: 'Failed to load pending hours' }, { status: 500 });
    }

    if (!hours || hours.length === 0) {
      return NextResponse.json({ entries: [] });
    }

    // Resolve apprentice names from profiles
    const userIds = [...new Set(hours.map((h: any) => h.user_id))];
    const { data: profiles } = await db
      .from('profiles')
      .select('id, full_name, first_name, last_name')
      .in('id', userIds);

    const nameMap = new Map(
      (profiles ?? []).map((p: any) => [
        p.id,
        p.full_name || `${p.first_name ?? ''} ${p.last_name ?? ''}`.trim() || 'Unknown',
      ])
    );

    const entries = hours.map((h: any) => ({
      id: h.id,
      apprenticeId: h.user_id,
      apprenticeName: nameMap.get(h.user_id) ?? 'Unknown',
      date: h.date,
      hours: h.hours ?? 0,
      minutes: h.minutes ?? 0,
      category: h.category ?? 'practical',
      notes: h.notes ?? null,
      submittedAt: h.submitted_at,
      // weekEnding for display — use the date itself for clock-in entries
      weekEnding: h.date,
    }));

    return NextResponse.json({ entries, shopName: shop.name });
  } catch (err) {
    logger.error('[pending-hours] Unexpected error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const GET = withApiAudit('/api/pwa/shop-owner/pending-hours', _GET);
