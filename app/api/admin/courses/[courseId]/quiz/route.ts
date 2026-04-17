/**
 * GET  /api/admin/courses/[courseId]/quiz  — load quiz metadata from courses table
 * PUT  /api/admin/courses/[courseId]/quiz  — save quiz metadata back to courses table
 *
 * NOTE: New programs store quiz questions in course_lessons.quiz_questions (per-lesson).
 * This endpoint manages the legacy course-level quiz stored in courses.metadata JSONB.
 * PUT returns 410 for courses that have migrated to the per-lesson system.
 */

import { NextRequest, NextResponse } from 'next/server';
import { apiRequireAdmin } from '@/lib/admin/guards';
import { getAdminClient } from '@/lib/supabase/admin';
import { applyRateLimit } from '@/lib/api/withRateLimit';
import { safeError, safeInternalError } from '@/lib/api/safe-error';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const QuestionSchema = z.object({
  question_text:  z.string().min(1, 'Question text is required'),
  question_type:  z.enum(['multiple_choice', 'true_false']).default('multiple_choice'),
  options:        z.array(z.string()).min(2, 'At least 2 options required'),
  correct_answer: z.string().min(1, 'Correct answer is required'),
  points:         z.number().int().min(1).default(1),
});

const QuizSaveSchema = z.object({
  quiz_title:         z.string().min(1).default('Course Assessment'),
  quiz_passing_score: z.number().int().min(0).max(100).default(70),
  quiz_questions:     z.array(QuestionSchema),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  const rateLimited = await applyRateLimit(request, 'api');
  if (rateLimited) return rateLimited;

  const auth = await apiRequireAdmin(request);
  if (auth.error) return auth.error;

  const { courseId } = await params;
  const db = await getAdminClient();

  const { data: course, error } = await db
    .from('courses')
    .select('metadata')
    .eq('id', courseId)  // was: .eq('id', id) — id is undeclared
    .single();

  if (error?.code === 'PGRST116') return safeError('Course not found', 404);
  if (error) return safeInternalError(error, 'Database error');

  const meta = (course?.metadata || {}) as Record<string, any>;
  return NextResponse.json({
    quiz_title:         meta.quiz_title         || 'Course Assessment',
    quiz_passing_score: meta.quiz_passing_score || 70,
    quiz_questions:     meta.quiz_questions     || [],
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  const rateLimited = await applyRateLimit(request, 'api');
  if (rateLimited) return rateLimited;

  const auth = await apiRequireAdmin(request);
  if (auth.error) return auth.error;

  const { courseId } = await params;

  const body = await request.json().catch(() => null);
  if (!body) return safeError('Invalid JSON', 400);

  const parsed = QuizSaveSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  for (const [qi, q] of parsed.data.quiz_questions.entries()) {
    if (!q.options.includes(q.correct_answer)) {
      return safeError(
        `Question ${qi + 1}: correct answer "${q.correct_answer}" is not in the options list.`,
        400,
      );
    }
  }

  // Quiz data is stored per-lesson in course_lessons.quiz_questions.
  // Course-level quiz metadata is no longer supported for migrated courses.
  // Use PATCH /api/admin/lms/courses/[courseId]/lessons/[lessonId] instead.
  const db = await getAdminClient();
  const { data: existing, error: fetchErr } = await db
    .from('courses')
    .select('metadata')
    .eq('id', courseId)  // was: .eq('id', id) — id is undeclared
    .single();

  if (fetchErr?.code === 'PGRST116') return safeError('Course not found', 404);
  if (fetchErr) return safeInternalError(fetchErr, 'Database error');

  const existingMeta = (existing?.metadata || {}) as Record<string, any>;

  // If this course has per-lesson quiz questions, reject the legacy write
  const { count: lessonQuizCount } = await db
    .from('course_lessons')
    .select('id', { count: 'exact', head: true })
    .eq('course_id', courseId)
    .not('quiz_questions', 'is', null);

  if ((lessonQuizCount ?? 0) > 0) {
    return NextResponse.json(
      { error: 'LEGACY_SYSTEM_DISABLED: quiz data is stored in course_lessons.quiz_questions — update via lesson API' },
      { status: 410 },
    );
  }

  const updatedMeta = {
    ...existingMeta,
    quiz_title:         parsed.data.quiz_title,
    quiz_passing_score: parsed.data.quiz_passing_score,
    quiz_questions:     parsed.data.quiz_questions,
  };

  const { error: updateError } = await db
    .from('courses')
    .update({ metadata: updatedMeta, updated_at: new Date().toISOString() })
    .eq('id', courseId);

  if (updateError) return safeInternalError(updateError, 'Failed to save quiz');

  return NextResponse.json({ success: true, quiz_questions: parsed.data.quiz_questions.length });
}
