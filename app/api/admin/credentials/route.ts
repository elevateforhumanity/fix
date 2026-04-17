/**
 * POST /api/admin/credentials — create a credential in the registry
 * GET  /api/admin/credentials — list all credentials (with optional stack filter)
 */
import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { apiRequireAdmin } from '@/lib/admin/guards';
import { safeError, safeInternalError } from '@/lib/api/safe-error';
import { logger } from '@/lib/logger';
import { mapCredentialRow, type RawCredentialRow } from '@/lib/domain';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await apiRequireAdmin(req);
  if (auth.error) return auth.error;

  const { searchParams } = new URL(req.url);
  const stack = searchParams.get('stack');
  const issuerType = searchParams.get('issuer_type');

  const db = await getAdminClient();
  let q = db.from('credential_registry').select('*').eq('is_active', true).order('credential_stack').order('name');
  if (stack) q = q.eq('credential_stack', stack);
  if (issuerType) q = q.eq('issuer_type', issuerType);

  const { data, error } = await q;
  if (error) return safeInternalError(error, 'Failed to fetch credentials');
  return NextResponse.json({ credentials: (data ?? []).map((r) => mapCredentialRow(r as RawCredentialRow)) });
}

export async function POST(req: NextRequest) {
  const auth = await apiRequireAdmin(req);
  if (auth.error) return auth.error;

  const body = await req.json().catch(() => null);
  if (!body?.name?.trim()) return safeError('name is required', 422);
  if (!body?.issuing_authority?.trim()) return safeError('issuing_authority is required', 422);
  if (!['elevate_issued','elevate_proctored','partner_delivered'].includes(body.issuer_type)) {
    return safeError('invalid issuer_type', 422);
  }

  // Enforce: if proctor_authority = elevate, set protected in metadata
  const metadata = {
    ...(body.metadata ?? {}),
    protected: body.proctor_authority === 'elevate',
    credential_owner: body.proctor_authority === 'elevate' ? 'elevate' : (body.issuing_authority ?? ''),
  };

  const db = await getAdminClient();
  const { data, error } = await db
    .from('credential_registry')
    .insert({ ...body, metadata, created_by: auth.user.id })
    .select()
    .single();

  if (error) {
    logger.error('POST credential error', error);
    return safeInternalError(error, 'Failed to create credential');
  }

  logger.info('Credential created', { name: body.name, issuer_type: body.issuer_type, userId: auth.user.id });
  return NextResponse.json({ credential: mapCredentialRow(data as RawCredentialRow) }, { status: 201 });
}
