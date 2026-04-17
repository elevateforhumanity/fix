/**
 * PATCH /api/admin/credentials/[credentialId] — update a credential
 * DELETE /api/admin/credentials/[credentialId] — soft-delete (is_active = false)
 */
import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { apiRequireAdmin } from '@/lib/admin/guards';
import { safeError, safeInternalError } from '@/lib/api/safe-error';
import { logger } from '@/lib/logger';
import { mapCredentialRow, type RawCredentialRow } from '@/lib/domain';

export const dynamic = 'force-dynamic';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ credentialId: string }> }
) {
  const auth = await apiRequireAdmin(req);
  if (auth.error) return auth.error;
  const { credentialId } = await params;

  const body = await req.json().catch(() => null);
  if (!body) return safeError('Invalid JSON', 400);

  const db = await getAdminClient();

  // Pre-read: verify credential exists before updating
  const { data: existing, error: fetchError } = await db
    .from('credential_registry')
    .select('id')
    .eq('id', credentialId)
    .maybeSingle();

  if (fetchError || !existing) {
    return safeError('Credential not found', 404);
  }

  // Re-derive protected flag if proctor_authority changed
  if (body.proctor_authority !== undefined) {
    body.metadata = {
      ...(body.metadata ?? {}),
      protected: body.proctor_authority === 'elevate',
      credential_owner: body.proctor_authority === 'elevate' ? 'elevate' : (body.issuing_authority ?? ''),
    };
  }

  const { data, error } = await db
    .from('credential_registry')
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq('id', credentialId)
    .select()
    .single();

  if (error) {
    logger.error('PATCH credential error', error);
    return safeInternalError(error, 'Failed to update credential');
  }
  return NextResponse.json({ credential: mapCredentialRow(data as RawCredentialRow) });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ credentialId: string }> }
) {
  const auth = await apiRequireAdmin(req);
  if (auth.error) return auth.error;
  const { credentialId } = await params;

  const db = await getAdminClient();

  // Pre-read: verify credential exists before soft-deleting
  const { data: existing, error: fetchError } = await db
    .from('credential_registry')
    .select('id, is_active')
    .eq('id', credentialId)
    .maybeSingle();

  if (fetchError || !existing) {
    return safeError('Credential not found', 404);
  }

  const { error } = await db
    .from('credential_registry')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('id', credentialId);

  if (error) return safeInternalError(error, 'Failed to deactivate credential');
  logger.info('Credential deactivated', { credentialId, userId: auth.user.id });
  return NextResponse.json({ ok: true });
}
