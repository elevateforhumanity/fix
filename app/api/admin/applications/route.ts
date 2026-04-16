import { NextResponse } from 'next/server';
import { apiRequireAdmin } from '@/lib/admin/guards';
import { ApplicationCreateSchema } from '@/lib/validators/course';
import { createApplication, listApplications } from '@/lib/db/courses';
import { applyRateLimit } from '@/lib/api/withRateLimit';
import { withApiAudit } from '@/lib/audit/withApiAudit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function _GET(request: Request) {
  
    const rateLimited = await applyRateLimit(request, 'api');
    if (rateLimited) return rateLimited;
const auth = const auth = await apiRequireAdmin(req);
  if (auth.error) return auth.error;
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const programId = searchParams.get('program_id') || undefined;
    const data = await listApplications({ status, programId });
    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function _POST(request: Request) {
    const rateLimited = await applyRateLimit(request, 'api');
    if (rateLimited) return rateLimited;

  const auth = const auth = await apiRequireAdmin(req);
  if (auth.error) return auth.error;
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  try {
    const body = await request.json().catch(() => null);
    const parsed = ApplicationCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
    }
    const data = await createApplication(parsed.data);
    
    // Log audit
    await auth.supabase.from('audit_logs').insert({
      actor_id: auth.auth.id,
      actor_role: auth.auth.profile?.role,
      action: 'create',
      resource_type: 'application',
      resource_id: data.id,
      after_state: data,
    });
    
    return NextResponse.json({ data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
export const GET = withApiAudit('/api/admin/applications', _GET);
export const POST = withApiAudit('/api/admin/applications', _POST);
