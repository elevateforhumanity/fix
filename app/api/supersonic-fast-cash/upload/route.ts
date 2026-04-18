// PUBLIC ROUTE: SupersonicFastCash document upload.
// Accepts multipart/form-data: one or more files + optional lead_id.
// If lead_id is provided, writes sfc_documents rows linked to the lead.
// Also upserts/creates an sfc_leads row so every upload is tracked.
// NOTE: SSN is never accepted or stored here — that is handled at filing time under encryption.
import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { logger } from '@/lib/logger';
import { applyRateLimit } from '@/lib/api/withRateLimit';
import { auditPiiAccess } from '@/lib/auditLog';
import { hydrateProcessEnv } from '@/lib/secrets';
import { safeError, safeInternalError } from '@/lib/api/safe-error';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/heic', 'image/heif'];
const MAX_FILE_BYTES = 20 * 1024 * 1024; // 20 MB
const BUCKET = 'sfc-documents';

export async function POST(request: Request) {
  await hydrateProcessEnv();
  try {
    const rateLimited = await applyRateLimit(request as Parameters<typeof applyRateLimit>[0], 'api');
    if (rateLimited) return rateLimited;

    await auditPiiAccess({
      action: 'PII_ACCESS',
      entity: 'tax_document',
      req: request,
      metadata: { route: '/api/supersonic-fast-cash/upload', method: 'POST' },
    });

    const formData = await request.formData();

    const firstName = String(formData.get('firstName') ?? '').trim();
    const lastName  = String(formData.get('lastName')  ?? '').trim();
    const email     = String(formData.get('email')     ?? '').trim().toLowerCase();
    const phone     = String(formData.get('phone')     ?? '').trim() || null;
    const leadId    = String(formData.get('lead_id')   ?? '').trim() || null;
    const notes     = String(formData.get('notes')     ?? '').trim() || null;

    if (!firstName || !lastName) return safeError('First and last name are required.', 400);
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return safeError('Valid email required.', 400);

    const files = formData.getAll('files') as File[];
    if (files.length === 0) return safeError('At least one file is required.', 400);

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return safeError(`File type ${file.type} is not accepted. Allowed: PDF, JPG, PNG, HEIC.`, 400);
      }
      if (file.size > MAX_FILE_BYTES) {
        return safeError(`File "${file.name}" exceeds the 20 MB limit.`, 400);
      }
    }

    const db = await getAdminClient();
    if (!db) return safeError('Service temporarily unavailable.', 503);

    // Ensure there's a lead row for this person
    let resolvedLeadId = leadId;
    if (!resolvedLeadId) {
      const { data: upserted, error: leadErr } = await db
        .from('sfc_leads')
        .upsert(
          { first_name: firstName, last_name: lastName, email, phone, source: 'upload', status: 'docs_pending' },
          { onConflict: 'email', ignoreDuplicates: false },
        )
        .select('id')
        .maybeSingle();
      if (leadErr) logger.error('[sfc/upload] Lead upsert error', leadErr);
      resolvedLeadId = upserted?.id ?? null;
    }

    // Upload files to Supabase Storage
    const uploadedUrls: string[] = [];
    for (const file of files) {
      const ext = file.name.split('.').pop() ?? 'bin';
      const path = `${resolvedLeadId ?? 'anonymous'}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      const { error: storErr } = await db.storage.from(BUCKET).upload(path, buffer, {
        contentType: file.type,
        upsert: false,
      });
      if (storErr) {
        logger.error('[sfc/upload] Storage upload error', storErr);
        // Continue — try to save what we can
        continue;
      }
      const { data: urlData } = db.storage.from(BUCKET).getPublicUrl(path);
      uploadedUrls.push(urlData.publicUrl);

      // Write sfc_documents row
      if (resolvedLeadId) {
        await db.from('sfc_documents').insert({
          lead_id:     resolvedLeadId,
          file_url:    urlData.publicUrl,
          file_name:   file.name,
          file_type:   ext,
          file_size:   file.size,
          doc_category: 'other',
        });
      }
    }

    // Update lead status to docs_received
    if (resolvedLeadId) {
      await db.from('sfc_leads').update({ status: 'docs_received' }).eq('id', resolvedLeadId);
    }

    // Admin notification via SendGrid
    const sgKey = process.env.SENDGRID_API_KEY;
    if (sgKey) {
      await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sgKey}` },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: 'elevate4humanityedu@gmail.com' }] }],
          from: { name: 'Supersonic Fast Cash', email: 'noreply@elevateforhumanity.org' },
          subject: `[DOCS] ${firstName} ${lastName} uploaded ${files.length} file(s)`,
          content: [{
            type: 'text/html',
            value: `<h2>New Document Upload</h2>
              <p><strong>Name:</strong> ${firstName} ${lastName}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone ?? '—'}</p>
              <p><strong>Lead ID:</strong> ${resolvedLeadId ?? '—'}</p>
              <p><strong>Files:</strong> ${files.map((f) => f.name).join(', ')}</p>
              <p><strong>Notes:</strong> ${notes ?? 'None'}</p>`,
          }],
        }),
      }).catch((err) => logger.error('[sfc/upload] Admin email failed', err));
    }

    return NextResponse.json({ success: true, uploaded: uploadedUrls.length, lead_id: resolvedLeadId });
  } catch (error) {
    return safeInternalError(error as Error, 'Failed to process document upload');
  }
}

