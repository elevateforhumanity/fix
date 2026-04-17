
/**
 * PATCH /api/admin/lms/courses/[courseId]  — update a canonical course
 * DELETE /api/admin/lms/courses/[courseId] — archive a canonical course
 *
 * Writes to: courses (canonical table only).
 * DELETE sets status='archived', never hard-deletes.
 */

import { NextRequest, NextResponse } from 'next/server';
import { apiRequireAdmin } from '@/lib/admin/guards';
import { createClient } from '@/lib/supabase/server';
import { safeInternalError, safeDbError } from '@/lib/api/safe-error';
export const runtime = 'nodejs';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const auth = await apiRequireAdmin(request);
    if (auth.error) return auth.error;

    const supabase = await createClient();

    const { courseId } = await params;
    const body = await request.json();

    // Whitelist updatable fields. status may be set to 'draft' to unpublish;
    // use /publish endpoint to publish (enforces health check).
    const allowed = ['title', 'short_description', 'description', 'slug', 'status'] as const;
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    for (const key of allowed) {
      if (key in body) updates[key] = body[key];
    }

    const { data, error } = await supabase
      .from('courses')
      .update(updates)
      .eq('id', courseId)
      .select('id, slug, title, status')
      .single();

    if (error) return safeDbError(error, 'DB query failed');
    return NextResponse.json({ course: data });
  } catch (error) {
    return safeInternalError(error, 'Failed to update course');
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const auth = await apiRequireAdmin(request);
    if (auth.error) return auth.error;

    const supabase = await createClient();

    const { courseId } = await params;

    // Pre-read: verify course exists before archiving
    const { data: existing, error: fetchErr } = await supabase
      .from('courses')
      .select('id')
      .eq('id', courseId)
      .maybeSingle();

    if (fetchErr || !existing) return NextResponse.json({ error: 'Course not found' }, { status: 404 });

    // Archive, never hard-delete — preserves enrollment history
    const { error } = await supabase
      .from('courses')
      .update({ status: 'archived', is_active: false, updated_at: new Date().toISOString() })
      .eq('id', courseId);

    if (error) return safeDbError(error, 'DB query failed');
    return NextResponse.json({ success: true });
  } catch (error) {
    return safeInternalError(error, 'Failed to archive course');
  }
}
