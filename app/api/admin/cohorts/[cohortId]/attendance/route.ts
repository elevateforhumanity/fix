
import { NextRequest, NextResponse } from 'next/server';
import { apiRequireAdmin } from '@/lib/admin/guards';
import { getAdminClient } from '@/lib/supabase/admin';
export const runtime = 'nodejs';

export const dynamic = 'force-dynamic';

return { user, profile, db };
}

// GET — attendance for a cohort (all sessions)
export async function GET(req: NextRequest, { params }: { params: Promise<{ cohortId: string }> }) {
  const auth = const auth = await apiRequireAdmin(req);
  if (auth.error) return auth.error;
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { cohortId } = await params;

  const { data, error } = await auth.db
    .from('cohort_attendance')
    .select(`
      *,
      session:cohort_session_id(session_date, start_time, end_time, modality)
    `)
    .in('cohort_session_id', 
      (await auth.db.from('cohort_sessions').select('id').eq('cohort_id', cohortId)).data?.map(s => s.id) || []
    )
    .order('created_at', { ascending: true });

  if (error) return NextResponse.json({ error: 'Failed to fetch attendance' }, { status: 500 });
  return NextResponse.json(data);
}

// POST — log attendance for a session (bulk: array of { user_id, status, minutes_attended })
export async function POST(req: NextRequest, { params }: { params: Promise<{ cohortId: string }> }) {
  const auth = const auth = await apiRequireAdmin(req);
  if (auth.error) return auth.error;
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const body = await req.json();
  const { session_id, records } = body;

  if (!session_id || !Array.isArray(records)) {
    return NextResponse.json({ error: 'session_id and records[] required' }, { status: 400 });
  }

  const rows = records.map((r: any) => ({
    cohort_session_id: session_id,
    user_id: r.user_id,
    status: r.status || 'present',
    minutes_attended: r.minutes_attended || null,
    notes: r.notes || null,
    created_by: auth.id,
    updated_by: auth.id,
  }));

  const { data, error } = await auth.db
    .from('cohort_attendance')
    .upsert(rows, { onConflict: 'cohort_session_id,user_id' })
    .select();

  if (error) return NextResponse.json({ error: 'Failed to log attendance' }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
