// Redirects admin to Google OAuth consent screen for Classroom scopes.
import { NextRequest, NextResponse } from 'next/server';
import { apiRequireAdmin } from '@/lib/admin/guards';
import { getClassroomAuthUrl, isClassroomConfigured } from '@/lib/integrations/google-classroom';
import { safeError } from '@/lib/api/safe-error';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await apiRequireAdmin(req);
  if (auth.error) return auth.error;

  if (!isClassroomConfigured()) {
    return safeError('GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set.', 503);
  }

  const origin = req.nextUrl.origin;
  const redirectUri = `${origin}/api/integrations/google-classroom/callback`;
  const state = Buffer.from(JSON.stringify({ adminId: auth.id })).toString('base64url');
  const url = getClassroomAuthUrl(redirectUri, state);

  return NextResponse.redirect(url);
}
