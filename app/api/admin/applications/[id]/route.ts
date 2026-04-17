import { NextRequest, NextResponse } from 'next/server';
import { apiRequireAdmin } from '@/lib/admin/guards';
import { ApplicationUpdateSchema } from '@/lib/validators/course';
import { getApplication, updateApplication, deleteApplication } from '@/lib/db/courses';
import { getAdminClient } from '@/lib/supabase/admin';
import { applyRateLimit } from '@/lib/api/withRateLimit';
import { logger } from '@/lib/logger';
import { withApiAudit } from '@/lib/audit/withApiAudit';
import { sendEmail } from '@/lib/email/sendgrid';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function _GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const rateLimited = await applyRateLimit(request, 'api');
  if (rateLimited) return rateLimited;

  const auth = await apiRequireAdmin(request);
  if (auth.error) return auth.error;

  const { id } = await params;

  try {
    const data = await getApplication(id);
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ data });
  } catch (err) {
    logger.error('[GET /applications/:id]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function _PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const rateLimited = await applyRateLimit(request, 'api');
  if (rateLimited) return rateLimited;

  const auth = await apiRequireAdmin(request);
  if (auth.error) return auth.error;

  const { id } = await params;

  try {
    const before = await getApplication(id);
    if (!before) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const body = await request.json().catch(() => null);
    const parsed = ApplicationUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
    }
    if (Object.keys(parsed.data).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    const updateData: Record<string, unknown> = { ...parsed.data };
    if (updateData.status === 'approved' || updateData.status === 'rejected') {
      updateData.reviewer_id = auth.id;
      updateData.reviewed_at = new Date().toISOString();
    }

    const data = await updateApplication(id, updateData as Parameters<typeof updateApplication>[1]);

    const db = await getAdminClient();
    await db.from('audit_logs').insert({
      actor_id: auth.id,
      action: updateData.status === 'approved' ? 'approve'
             : updateData.status === 'rejected' ? 'reject'
             : 'status_change',
      resource_type: 'application',
      resource_id: id,
      before_state: before,
      after_state: data,
    }).catch(() => {});

    // Send rejection email — non-blocking
    if (updateData.status === 'rejected' && (before as any)?.email) {
      const app = before as any;
      const firstName = app.first_name || app.full_name?.split(' ')[0] || 'Applicant';
      const programName = app.program_slug || app.program_interest || 'the program';
      sendEmail({
        to: [app.email],
        from: 'Elevate for Humanity <info@elevateforhumanity.org>',
        subject: 'Update on Your Application — Elevate for Humanity',
        html: `<p>Hi ${firstName},</p>
<p>Thank you for your interest in <strong>${programName}</strong> at Elevate for Humanity.</p>
<p>After careful review, we are unable to move forward with your application at this time.</p>
<p>We encourage you to explore other programs at <a href="https://www.elevateforhumanity.org/programs">elevateforhumanity.org/programs</a> or contact us at <a href="mailto:info@elevateforhumanity.org">info@elevateforhumanity.org</a> with any questions.</p>
<br/><p>Warm regards,<br/>Elevate for Humanity Team</p>`,
      }).catch((err: Error) => logger.error('[PATCH /applications/:id] rejection email failed', err));
    }

    return NextResponse.json({ data });
  } catch (err) {
    logger.error('[PATCH /applications/:id]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function _DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const rateLimited = await applyRateLimit(request, 'api');
  if (rateLimited) return rateLimited;

  const auth = await apiRequireAdmin(request);
  if (auth.error) return auth.error;

  const { id } = await params;

  try {
    const before = await getApplication(id);
    if (!before) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    await deleteApplication(id);

    const db = await getAdminClient();
    await db.from('audit_logs').insert({
      actor_id: auth.id,
      action: 'delete',
      resource_type: 'application',
      resource_id: id,
      before_state: before,
    }).catch(() => {});

    return NextResponse.json({ success: true });
  } catch (err) {
    logger.error('[DELETE /applications/:id]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const GET    = withApiAudit('/api/admin/applications/[id]', _GET);
export const PATCH  = withApiAudit('/api/admin/applications/[id]', _PATCH);
export const DELETE = withApiAudit('/api/admin/applications/[id]', _DELETE);
