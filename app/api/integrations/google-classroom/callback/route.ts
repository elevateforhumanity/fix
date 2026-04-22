// Handles Google OAuth callback — exchanges code for tokens and stores them.
import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { exchangeClassroomCode } from '@/lib/integrations/google-classroom';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams, origin } = req.nextUrl;
  const code  = searchParams.get('code');
  const error = searchParams.get('error');
  const state = searchParams.get('state');

  if (error || !code) {
    logger.error('[Classroom callback] OAuth error', { error });
    return NextResponse.redirect(`${origin}/admin/integrations/google-classroom?error=oauth_denied`);
  }

  let adminId: string | null = null;
  try {
    const decoded = JSON.parse(Buffer.from(state ?? '', 'base64url').toString());
    adminId = decoded.adminId ?? null;
  } catch {
    return NextResponse.redirect(`${origin}/admin/integrations/google-classroom?error=invalid_state`);
  }

  const redirectUri = `${origin}/api/integrations/google-classroom/callback`;
  const tokens = await exchangeClassroomCode(code, redirectUri);

  if (!tokens) {
    return NextResponse.redirect(`${origin}/admin/integrations/google-classroom?error=token_exchange`);
  }

  const db = await getAdminClient();
  if (!db) {
    return NextResponse.redirect(`${origin}/admin/integrations/google-classroom?error=db_unavailable`);
  }

  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString();

  const { error: dbErr } = await db.from('integration_tokens').upsert({
    user_id: adminId,
    provider: 'google_classroom',
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_at: expiresAt,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id,provider' });

  if (dbErr) {
    logger.error('[Classroom callback] failed to store tokens', dbErr);
    return NextResponse.redirect(`${origin}/admin/integrations/google-classroom?error=db_error`);
  }

  return NextResponse.redirect(`${origin}/admin/integrations/google-classroom?connected=1`);
}
