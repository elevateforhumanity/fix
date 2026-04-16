import { NextRequest, NextResponse } from 'next/server';
import { apiRequireAdmin } from '@/lib/admin/guards';
import { ApplicationUpdateSchema } from '@/lib/validators/course';
import { getApplication, updateApplication, deleteApplication } from '@/lib/db/courses';
import { getAdminClient } from '@/lib/supabase/admin';
import { applyRateLimit } from '@/lib/api/withRateLimit';
import { logger } from '@/lib/logger';
import { withApiAudit } from '@/lib/audit/withApiAudit';

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
