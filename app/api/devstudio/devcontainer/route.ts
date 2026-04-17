import { NextRequest, NextResponse } from 'next/server';
import { apiRequireAdmin } from '@/lib/admin/guards';
import { safeError, safeInternalError } from '@/lib/api/safe-error';
import fs from 'fs/promises';
import path from 'path';

const DEVCONTAINER_PATH = path.join(process.cwd(), '.devcontainer', 'devcontainer.json');

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await apiRequireAdmin(request);
  if (auth.error) return auth.error;

  try {
    const raw = await fs.readFile(DEVCONTAINER_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    return NextResponse.json({ raw, parsed });
  } catch (err) {
    return safeInternalError(err, 'Failed to read devcontainer.json');
  }
}

export async function PUT(request: NextRequest) {
  const auth = await apiRequireAdmin(request);
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const { content } = body as { content: string };

    if (!content || typeof content !== 'string') {
      return safeError('content is required', 400);
    }

    // Validate it's valid JSON before writing
    JSON.parse(content);

    await fs.writeFile(DEVCONTAINER_PATH, content, 'utf-8');
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof SyntaxError) {
      return safeError('Invalid JSON: ' + err.message, 400);
    }
    return safeInternalError(err, 'Failed to write devcontainer.json');
  }
}
