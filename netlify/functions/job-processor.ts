import type { Handler } from '@netlify/functions';

const json = (statusCode: number, body: Record<string, unknown>) => ({
  statusCode,
  headers: {
    'content-type': 'application/json',
    'cache-control': 'no-store',
  },
  body: JSON.stringify(body),
});

export const handler: Handler = async (event) => {
  try {
    const token = process.env.JOB_PROCESSOR_TOKEN;
    const auth = event.headers.authorization || event.headers.Authorization;

    if (!token) {
      return json(500, { ok: false, message: 'Missing JOB_PROCESSOR_TOKEN' });
    }

    if (auth !== `Bearer ${token}`) {
      return json(401, { ok: false, message: 'Unauthorized' });
    }

    let payload: any = {};
    try {
      payload = event.body ? JSON.parse(event.body) : {};
    } catch {
      return json(400, { ok: false, message: 'Invalid JSON body' });
    }

    const required = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];
    const missing = required.filter((k) => !process.env[k]);

    if (missing.length) {
      return json(500, {
        ok: false,
        message: 'Missing required environment variables',
        errors: missing,
      });
    }

    let processed = 0;
    const errors: string[] = [];
    const jobs = Array.isArray(payload.jobs) ? payload.jobs : [];

    for (const job of jobs) {
      try {
        if (!job || typeof job !== 'object') {
          throw new Error('Invalid job payload');
        }

        // TODO: replace with your real processing logic
        // await saveJob(job)

        processed++;
      } catch (err) {
        errors.push(err instanceof Error ? err.message : 'Unknown job error');
      }
    }

    return json(200, {
      ok: true,
      message: 'Job processing completed',
      processed,
      errors,
    });
  } catch (error) {
    console.error('job-processor crashed', error);
    return json(500, {
      ok: false,
      message: error instanceof Error ? error.message : 'Unknown function error',
    });
  }
};
