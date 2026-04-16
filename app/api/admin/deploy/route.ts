import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';
import { applyRateLimit } from '@/lib/api/withRateLimit';
import { withApiAudit } from '@/lib/audit/withApiAudit';

export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/deploy
 * Triggers a Netlify deployment via build hook
 */
async function _POST(request: Request) {
  try {
    const rateLimited = await applyRateLimit(request, 'api');
    if (rateLimited) return rateLimited;

    // Verify admin access
    const auth = await apiRequireAdmin(req);
  if (auth.error) return auth.error;

      }

    // Trigger Netlify build hook
    const buildHookUrl = process.env.NETLIFY_BUILD_HOOK_URL;
    
    if (!buildHookUrl) {
      return NextResponse.json({ 
        error: 'Build hook not configured',
        message: 'Set NETLIFY_BUILD_HOOK_URL in environment variables'
      }, { status: 500 });
    }

    const response = await fetch(buildHookUrl, {
      method: 'POST',
    });

    if (response.ok) {
      return NextResponse.json({ 
        success: true, 
        message: 'Deployment triggered successfully' 
      });
    } else {
      return NextResponse.json({ 
        error: 'Failed to trigger deployment',
        status: response.status 
      }, { status: 500 });
    }
  } catch (error) {
    logger.error('Deploy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
export const POST = withApiAudit('/api/admin/deploy', _POST);
