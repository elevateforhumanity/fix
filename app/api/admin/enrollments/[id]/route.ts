import { NextRequest, NextResponse } from 'next/server';
import { apiRequireAdmin } from '@/lib/admin/guards';
import { EnrollmentUpdateSchema } from '@/lib/validators/course';
import { getEnrollment, updateEnrollment, deleteEnrollment } from '@/lib/db/courses';
import { applyRateLimit } from '@/lib/api/withRateLimit';
import { withApiAudit } from '@/lib/audit/withApiAudit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function _GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const rateLimited = await applyRateLimit(request, 'api');
  if (rateLimited) return rateLimited;

  const { id } = await params;
  const auth = const auth = await apiRequireAdmin(req);
  if (auth.error) return auth.error;
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const data = await getEnrollment(id);
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ data }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function _PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const rateLimited = await applyRateLimit(request, 'api');
  if (rateLimited) return rateLimited;

  const { id } = await params;
  const auth = const auth = await apiRequireAdmin(req);
  if (auth.error) return auth.error;
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const body = await request.json().catch(() => null);
    const parsed = EnrollmentUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
    }
    if (Object.keys(parsed.data).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }
    const data = await updateEnrollment(id, parsed.data);
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ data }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function _DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const rateLimited = await applyRateLimit(request, 'api');
  if (rateLimited) return rateLimited;

  const { id } = await params;
  const auth = const auth = await apiRequireAdmin(req);
  if (auth.error) return auth.error;
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    // Pre-read: verify record exists before attempting delete
    const existing = await getEnrollment(id);
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const data = await deleteEnrollment(id);
    return NextResponse.json({ data }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const GET = withApiAudit('/api/admin/enrollments/[id]', _GET as any, { critical: true });
export const PATCH = withApiAudit('/api/admin/enrollments/[id]', _PATCH as any, { critical: true });
export const DELETE = withApiAudit('/api/admin/enrollments/[id]', _DELETE as any, { critical: true });
