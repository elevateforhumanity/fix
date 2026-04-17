/**
 * /api/admin/programs/[programId]/courses
 *
 * GET  — list internal courses attached to this program (via program_courses)
 * POST — attach an internal course to this program
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdminClient } from '@/lib/supabase/admin';
import { apiRequireAdmin } from '@/lib/admin/guards';
import { safeError, safeInternalError } from '@/lib/api/safe-error';
import { logger } from '@/lib/logger';
import { mapCourseRow, type RawCourseRow } from '@/lib/domain';

export const dynamic = 'force-dynamic';

const AttachSchema = z.object({
  course_id:   z.string().uuid('Must be a valid course UUID'),
  is_required: z.boolean().default(true),
  order_index:  z.number().int().min(0).default(0),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ programId: string }> }
) {
  const auth = await apiRequireAdmin(req);
  if (auth.error) return auth.error;
  const { programId } = await params;

  const db = await getAdminClient();
  const { data, error } = await db
    .from('program_courses')
    .select(`
      id, order_index, is_required,
      course:courses(id, title, slug, status, short_description)
    `)
    .eq('program_id', programId)
    .order('order_index');

  if (error) {
    logger.error('GET program courses error', error);
    return safeInternalError(error, 'Failed to fetch program courses');
  }
  // Normalize course sub-rows through the domain mapper to resolve title/course_name drift
  const items = (data ?? []).map((row) => ({
    id: row.id,
    order_index: row.order_index,
    is_required: row.is_required,
    course: row.course ? mapCourseRow(row.course as RawCourseRow) : null,
  }));
  return NextResponse.json({ items });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ programId: string }> }
) {
  const auth = await apiRequireAdmin(req);
  if (auth.error) return auth.error;
  const { programId } = await params;

  const body = await req.json().catch(() => null);
  if (!body) return safeError('Invalid JSON', 400);

  const parsed = AttachSchema.safeParse(body);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    return safeError(issues, 422);
  }

  const db = await getAdminClient();
  const { data, error } = await db
    .from('program_courses')
    .upsert(
      { program_id: programId, ...parsed.data },
      { onConflict: 'program_id,course_id', ignoreDuplicates: false }
    )
    .select()
    .single();

  if (error) {
    logger.error('POST program course attach error', error);
    return safeInternalError(error, 'Failed to attach course to program');
  }

  logger.info('Internal course attached to program', { programId, courseId: parsed.data.course_id, userId: auth.user.id });
  return NextResponse.json({ item: data }, { status: 201 });
}
