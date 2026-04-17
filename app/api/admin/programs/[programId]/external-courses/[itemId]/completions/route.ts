/**
 * /api/admin/programs/[programId]/external-courses/[itemId]/completions
 *
 * GET  — list all learner completions for this external item
 * POST — mark a learner as complete (admin action)
 * DELETE — remove a completion record (admin action)
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdminClient } from '@/lib/supabase/admin';
import { apiRequireAdmin } from '@/lib/admin/guards';
import { safeError, safeInternalError } from '@/lib/api/safe-error';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ programId: string; itemId: string }> }
) {
  const auth = await apiRequireAdmin(req);
  if (auth.error) return auth.error;
  const { programId, itemId } = await params;

  const db = await getAdminClient();
  const { data, error } = await db
    .from('program_external_completions')
    .select(`
      id, completed_at, notes, proof_url,
      learner:profiles!program_external_completions_user_id_fkey(id, full_name, email),
      marked_by_profile:profiles!program_external_completions_marked_by_fkey(id, full_name)
    `)
    .eq('external_course_id', itemId)
    .eq('program_id', programId)
    .order('completed_at', { ascending: false });

  if (error) return safeInternalError(error, 'Failed to fetch completions');
  return NextResponse.json({ completions: data ?? [] });
}

const MarkCompleteSchema = z.object({
  user_id:   z.string().uuid('Must be a valid user UUID'),
  notes:     z.string().optional().default(''),
  proof_url: z.string().url().optional().or(z.literal('')),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ programId: string; itemId: string }> }
) {
  const auth = await apiRequireAdmin(req);
  if (auth.error) return auth.error;
  const { programId, itemId } = await params;

  const body = await req.json().catch(() => null);
  if (!body) return safeError('Invalid JSON', 400);

  const parsed = MarkCompleteSchema.safeParse(body);
  if (!parsed.success) {
    return safeError('Invalid request body', 422);
  }

  const db = await getAdminClient();
  const { data, error } = await db
    .from('program_external_completions')
    .upsert(
      {
        external_course_id: itemId,
        program_id:         programId,
        user_id:            parsed.data.user_id,
        marked_by:          auth.user.id,
        notes:              parsed.data.notes || null,
        proof_url:          parsed.data.proof_url || null,
        completed_at:       new Date().toISOString(),
      },
      { onConflict: 'external_course_id,user_id', ignoreDuplicates: false }
    )
    .select()
    .maybeSingle();

  if (error) {
    logger.error('Mark external complete error', error);
    return safeInternalError(error, 'Failed to mark completion');
  }

  logger.info('External training marked complete', { itemId, userId: parsed.data.user_id, adminId: auth.user.id });
  return NextResponse.json({ completion: data }, { status: 201 });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ programId: string; itemId: string }> }
) {
  const auth = await apiRequireAdmin(req);
  if (auth.error) return auth.error;
  const { itemId } = await params;

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('user_id');
  if (!userId) return safeError('user_id required', 400);

  const db = await getAdminClient();
  const { error } = await db
    .from('program_external_completions')
    .delete()
    .eq('external_course_id', itemId)
    .eq('user_id', userId);

  if (error) return safeInternalError(error, 'Failed to remove completion');
  return NextResponse.json({ ok: true });
}
