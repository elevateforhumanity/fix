import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';
import { applyRateLimit } from '@/lib/api/withRateLimit';
import { safeError, safeInternalError } from '@/lib/api/safe-error';
import { withApiAudit } from '@/lib/audit/withApiAudit';

export const runtime = 'nodejs';
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

async function _POST(req: NextRequest) {
  // Legal write endpoint — use strict tier (3 req / 5 min)
  const rateLimited = await applyRateLimit(req, 'strict');
  if (rateLimited) return rateLimited;

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return safeError('Unauthorized', 401);

    const { data: callerProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (!callerProfile || !['program_holder', 'admin', 'super_admin'].includes(callerProfile.role ?? '')) {
      return safeError('This endpoint is for program holders only.', 403);
    }

    const body = await req.json();
    const { fullName, title } = body;

    if (!fullName || !title) {
      return safeError('Full name and title are required', 400);
    }

    const { data, error } = await supabase
      .from('program_holder_acknowledgements')
      .insert({
        user_id:         user.id,
        document_type:   'rights',
        full_name:       fullName,
        title,
        acknowledged_at: new Date().toISOString(),
        ip_address:      req.headers.get('x-forwarded-for') || 'unknown',
        user_agent:      req.headers.get('user-agent') || 'unknown',
      })
      .select()
      .single();

    if (error) {
      return safeInternalError(error, 'Failed to record acknowledgement');
    }

    logger.info('[Acknowledge Rights] Success', { userId: user.id, fullName, title });

    return Response.json({ success: true, message: 'Rights & Responsibilities acknowledgement recorded', data });
  } catch (err) {
    return safeInternalError(err as Error, 'Acknowledge rights error');
  }
}

export const POST = withApiAudit('/api/program-holder/acknowledge-rights', _POST);
