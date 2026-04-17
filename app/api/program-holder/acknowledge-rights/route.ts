import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';
import { applyRateLimit } from '@/lib/api/withRateLimit';
import { withApiAudit } from '@/lib/audit/withApiAudit';
export const runtime = 'nodejs';
export const maxDuration = 60;

export const dynamic = 'force-dynamic';

async function _POST(req: Request) {
  try {
    const rateLimited = await applyRateLimit(req, 'api');
    if (rateLimited) return rateLimited;

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Guard: only program holders may acknowledge program holder rights.
    const { data: callerProfile } = await supabase
      .from('profiles')
      .select('role, email, full_name')
      .eq('id', user.id)
      .maybeSingle();

    if (!callerProfile || !['program_holder', 'admin', 'super_admin'].includes(callerProfile.role ?? '')) {
      return NextResponse.json(
        { error: 'This endpoint is for program holders only.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { fullName, title } = body;

    if (!fullName || !title) {
      return NextResponse.json(
        { error: 'Full name and title are required' },
        { status: 400 }
      );
    }

    const profile = callerProfile;

    // Insert acknowledgement — only live schema columns
    const { data, error }: any = await supabase
      .from('program_holder_acknowledgements')
      .insert({
        user_id: user.id,
        document_type: 'rights',
        full_name: fullName,
        title,
        acknowledged_at: new Date().toISOString(),
        ip_address: (req as any).headers?.get?.('x-forwarded-for') || 'unknown',
        user_agent: (req as any).headers?.get?.('user-agent') || 'unknown',
      })
      .select()
      .single();

    if (error) {
      logger.error('[Acknowledge Rights] Error:', error);
      return NextResponse.json(
        { error: 'Failed to record acknowledgement' },
        { status: 500 }
      );
    }

    logger.info('[Acknowledge Rights] Success:', {
      userId: user.id,
      fullName,
      title,
    });

    return NextResponse.json({
      success: true,
      message: 'Rights & Responsibilities acknowledgement recorded',
      data,
    });
  } catch (err: any) {
    logger.error(
      '[Acknowledge Rights] Error:',
      err instanceof Error ? err : new Error(String(err))
    );
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
export const POST = withApiAudit('/api/program-holder/acknowledge-rights', _POST);
