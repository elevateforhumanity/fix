/**
 * /api/admin/programs/[programId]/courses/[linkId]
 *
 * PATCH  — update sort_order or is_required on a program_courses row
 * DELETE — detach an internal course from this program
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdminClient } from '@/lib/supabase/admin';
import { apiRequireAdmin } from '@/lib/admin/guards';
import { safeError, safeInternalError } from '@/lib/api/safe-error';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

const PatchSchema = z.object({
  is_required: z.boolean().optional(),
  order_index:  z.number().int().min(0).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ programId: string; linkId: string }> }
) {
  const auth = await apiRequireAdmin(req);
  if (auth.error) return auth.error;
  const { programId, linkId } = await params;

  const body = await req.json().catch(() => null);
  if (!body) return safeError('Invalid JSON', 400);

  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) {
    return safeError('Invalid request body', 422);
  }

  const db = await getAdminClient();
  const { data, error } = await db
    .from('program_courses')
    .update(parsed.data)
    .eq('id', linkId)
    .eq('program_id', programId)
    .select()
    .single();

  if (error) return safeInternalError(error, 'Failed to update program course link');
  return NextResponse.json({ item: data });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ programId: string; linkId: string }> }
) {
  const auth = await apiRequireAdmin(req);
  if (auth.error) return auth.error;
  const { programId, linkId } = await params;

  const db = await getAdminClient();
  const { error } = await db
    .from('program_courses')
    .delete()
    .eq('id', linkId)
    .eq('program_id', programId);

  if (error) {
    logger.error('DELETE program course link error', error);
    return safeInternalError(error, 'Failed to detach course from program');
  }
  return NextResponse.json({ ok: true });
}
