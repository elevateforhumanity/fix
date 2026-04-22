import { NextRequest, NextResponse } from 'next/server';
import { apiRequireAdmin } from '@/lib/admin/guards';
import { getAIService } from '@/lib/ai/ai-service';
import { safeError, safeInternalError } from '@/lib/api/safe-error';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const auth = await apiRequireAdmin(req);
  if (auth.error) return auth.error;

  const ai = getAIService();
  if (!ai) return safeError('No AI provider is configured.', 503);

  try {
    const result = await ai.chat({
      messages: [{ role: 'user', content: 'Reply with exactly: "Elevate AI is working."' }],
      maxTokens: 20,
      temperature: 0,
    });

    return NextResponse.json({
      ok: true,
      provider: result.provider ?? 'unknown',
      response: result.content?.trim() ?? '',
    });
  } catch (err) {
    return safeInternalError(err, 'AI test failed');
  }
}
