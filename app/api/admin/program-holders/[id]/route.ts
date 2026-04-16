import { NextRequest, NextResponse } from 'next/server';
import { apiRequireAdmin } from '@/lib/admin/guards';
import { getAdminClient } from '@/lib/supabase/admin';
import { applyRateLimit } from '@/lib/api/withRateLimit';
import { withApiAudit } from '@/lib/audit/withApiAudit';

export const runtime = 'nodejs';
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

async function _GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const rateLimited = await applyRateLimit(req, 'api');
  if (rateLimited) return rateLimited;

  const auth = await apiRequireAdmin(req as NextRequest);
  if (auth.error) return auth.error;

  const { id } = await params;
  const db = await getAdminClient();

  const { data: ph, error } = await db
    .from('program_holders')
    .select(`
      id, name, organization_name, contact_name, contact_email,
      contact_phone, status, payout_share, mou_signed, mou_status,
      mou_holder_name, mou_holder_signed_at, mou_holder_sig_url,
      mou_final_pdf_url, approved_at, created_at, user_id
    `)
    .eq('id', id)
    .maybeSingle();

  if (error || !ph) {
    return NextResponse.json({ error: 'Program holder not found' }, { status: 404 });
  }

  return NextResponse.json(ph);
}

export const GET = withApiAudit('/api/admin/program-holders/[id]', _GET);
