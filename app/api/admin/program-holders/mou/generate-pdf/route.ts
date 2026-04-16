import { NextResponse } from 'next/server';
import { applyRateLimit } from '@/lib/api/withRateLimit';
import { withApiAudit } from '@/lib/audit/withApiAudit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function guardAdmin() {
  const auth = await apiRequireAdmin(req);
  if (auth.error) return auth.error;

    }
  return null;
}

// MOU PDF generation moved to reduce bundle size
async function _GET(request: Request) {
  
    const rateLimited = await applyRateLimit(request, 'api');
    if (rateLimited) return rateLimited;
const denied = await guardAdmin();
  if (denied) return denied;
  return NextResponse.json(
    { error: 'PDF generation temporarily unavailable' },
    { status: 503 }
  );
}

async function _POST(request: Request) {
    const rateLimited = await applyRateLimit(request, 'api');
    if (rateLimited) return rateLimited;

  const denied = await guardAdmin();
  if (denied) return denied;
  return NextResponse.json(
    { error: 'PDF generation temporarily unavailable' },
    { status: 503 }
  );
}
export const GET = withApiAudit('/api/admin/program-holders/mou/generate-pdf', _GET);
export const POST = withApiAudit('/api/admin/program-holders/mou/generate-pdf', _POST);
