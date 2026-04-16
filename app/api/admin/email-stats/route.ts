import { NextResponse } from 'next/server';

import { getEmailStats, getRecentFailures, checkEmailHealth } from '@/lib/email/monitor';
import { applyRateLimit } from '@/lib/api/withRateLimit';
import { withApiAudit } from '@/lib/audit/withApiAudit';
export const runtime = 'nodejs';
export const maxDuration = 60;

export const dynamic = 'force-dynamic';

async function _GET(req: Request) {
  try {
    const rateLimited = await applyRateLimit(req, 'api');
    if (rateLimited) return rateLimited;

    const auth = await apiRequireAdmin(req);
  if (auth.error) return auth.error;

      }

    const { searchParams } = new URL(req.url);
    const timeframe = (searchParams.get('timeframe') || '24h') as '24h' | '7d' | '30d';

    const [stats, failures, health] = await Promise.all([
      getEmailStats(timeframe),
      getRecentFailures(10),
      checkEmailHealth(),
    ]);

    return NextResponse.json({
      stats,
      failures,
      health,
      timeframe,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to fetch email statistics' },
      { status: 500 }
    );
  }
}
export const GET = withApiAudit('/api/admin/email-stats', _GET);
