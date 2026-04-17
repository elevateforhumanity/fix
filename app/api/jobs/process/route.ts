// PUBLIC ROUTE: Cron/internal route — gated by JOB_PROCESSOR_TOKEN
import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 10;

function getBaseUrl(req: NextRequest) {
  const proto = req.headers.get('x-forwarded-proto') ?? 'https';
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host');
  return `${proto}://${host}`;
}

export async function POST(req: NextRequest) {
  try {
    const token = process.env.JOB_PROCESSOR_TOKEN;
    const auth = req.headers.get('authorization');

    if (!token) {
      // Token not configured — return 503 (not 500) so monitoring doesn't alert as crash
      return NextResponse.json(
        { ok: false, message: 'Job processor not configured' },
        { status: 503 }
      );
    }

    if (auth !== `Bearer ${token}`) {
      return NextResponse.json(
        { ok: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      const res = await fetch(`${getBaseUrl(req)}/.netlify/functions/job-processor`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
        cache: 'no-store',
        signal: controller.signal,
      });

      const text = await res.text();
      let parsed: unknown = { ok: res.ok, message: text || 'No response body' };

      try {
        parsed = JSON.parse(text);
      } catch {}

      if (!res.ok) {
        logger.error('job-processor failed', parsed);
        return NextResponse.json(
          { ok: false, message: 'Job processor failed', details: parsed },
          { status: 502 }
        );
      }

      return NextResponse.json(parsed, { status: 200 });
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    logger.error('/api/jobs/process crashed', error);
    return NextResponse.json(
      { ok: false, message: 'Job processor failed' },
      { status: 500 }
    );
  }
}
