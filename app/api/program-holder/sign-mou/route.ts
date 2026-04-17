import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';
import { applyRateLimit } from '@/lib/api/withRateLimit';
import { safeError, safeInternalError } from '@/lib/api/safe-error';
import { withApiAudit } from '@/lib/audit/withApiAudit';
import {
  sendMOUSignedConfirmation,
  sendMOUSignedAdminNotification,
} from '@/lib/email-mou-notifications';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function _POST(request: NextRequest) {
  const rateLimited = await applyRateLimit(request, 'strict');
  if (rateLimited) return rateLimited;

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return safeError('Unauthorized', 401);

    const { signatureDataUrl, signerName, signerTitle } = await request.json();

    if (!signatureDataUrl || !signerName || !signerTitle) {
      return safeError('Signature, name, and title are required', 400);
    }

    const admin = await getAdminClient();

    // Fetch holder row — include fields needed for email notifications
    const { data: holderRow } = await admin
      .from('program_holders')
      .select('id, mou_signed, organization_name, contact_email')
      .eq('user_id', user.id)
      .maybeSingle();

    if (holderRow?.mou_signed) {
      return safeError('MOU already signed', 409);
    }

    const now = new Date().toISOString();

    // Use admin client so RLS on mou_signatures does not block the insert
    const { data: signature, error: sigError } = await admin
      .from('mou_signatures')
      .insert({
        user_id:           user.id,
        program_holder_id: holderRow?.id ?? null,
        partner_type:      'program_holder',
        signer_name:       signerName,
        signer_title:      signerTitle,
        signature_data:    signatureDataUrl,
        signed_at:         now,
        agreed_at:         now,
        agreed:            true,
        ip_address:        request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        user_agent:        request.headers.get('user-agent') || 'unknown',
        mou_version:       '2025-01',
      })
      .select('id')
      .maybeSingle();

    if (sigError || !signature) {
      logger.error('MOU signature storage failed', sigError as Error);
      return safeError('Failed to record signature', 500);
    }

    // Update program_holders — log error if it fails so the inconsistency is visible
    const { error: updateErr } = await admin
      .from('program_holders')
      .update({
        mou_signed:    true,
        mou_signed_at: now,
        mou_status:    'holder_signed',
        status:        'active',
      })
      .eq('user_id', user.id);

    if (updateErr) {
      logger.error('program_holders update failed after MOU signature', updateErr as Error, {
        userId:      user.id,
        signatureId: signature.id,
      });
      // Non-fatal — signature is recorded; admin can reconcile manually
    }

    // Fire confirmation to signer + admin alert — non-fatal so a transient
    // email failure does not roll back the recorded signature
    const emailData = {
      programHolderName: holderRow?.organization_name ?? signerName,
      signerName,
      signerTitle,
      contactEmail:      holderRow?.contact_email ?? user.email ?? '',
      signedAt:          now,
    };
    Promise.all([
      sendMOUSignedConfirmation(emailData),
      sendMOUSignedAdminNotification(emailData),
    ]).catch((e) => logger.error('MOU email dispatch failed', e as Error));

    return NextResponse.json({ success: true, signature_id: signature.id });
  } catch (error) {
    return safeInternalError(error as Error, 'MOU signing error');
  }
}

export const POST = withApiAudit('/api/program-holder/sign-mou', _POST);
