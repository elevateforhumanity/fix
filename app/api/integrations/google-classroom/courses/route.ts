// Returns active Google Classroom courses for the connected admin account.
import { NextRequest, NextResponse } from 'next/server';
import { apiRequireAdmin } from '@/lib/admin/guards';
import { getAdminClient } from '@/lib/supabase/admin';
import { listClassroomCourses, refreshClassroomToken } from '@/lib/integrations/google-classroom';
import { safeError, safeInternalError } from '@/lib/api/safe-error';
import { applyRateLimit } from '@/lib/api/withRateLimit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const rateLimited = await applyRateLimit(req, 'api');
  if (rateLimited) return rateLimited;

  const auth = await apiRequireAdmin(req);
  if (auth.error) return auth.error;

  const db = await getAdminClient();
  if (!db) return safeError('Database unavailable', 503);

  const { data: tokenRow } = await db
    .from('integration_tokens')
    .select('access_token, refresh_token, expires_at')
    .eq('user_id', auth.id)
    .eq('provider', 'google_classroom')
    .maybeSingle();

  if (!tokenRow) return safeError('Google Classroom not connected', 404);

  // Refresh token if expired
  let accessToken = tokenRow.access_token;
  if (tokenRow.expires_at && new Date(tokenRow.expires_at) <= new Date()) {
    const refreshed = await refreshClassroomToken(tokenRow.refresh_token);
    if (!refreshed) return safeError('Google Classroom token expired. Please reconnect.', 401);
    accessToken = refreshed.access_token;
    await db.from('integration_tokens').update({
      access_token: refreshed.access_token,
      expires_at: new Date(Date.now() + refreshed.expires_in * 1000).toISOString(),
    }).eq('user_id', auth.id).eq('provider', 'google_classroom');
  }

  try {
    const courses = await listClassroomCourses(accessToken);
    return NextResponse.json({ courses });
  } catch (err) {
    return safeInternalError(err, 'Failed to fetch Classroom courses');
  }
}
