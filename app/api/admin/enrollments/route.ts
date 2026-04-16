import { NextResponse } from 'next/server';
import { apiRequireAdmin } from '@/lib/admin/guards';
import { EnrollmentCreateSchema } from '@/lib/validators/course';
import { createEnrollment, listEnrollments } from '@/lib/db/courses';
import { applyRateLimit } from '@/lib/api/withRateLimit';
import { sendCourseEnrollmentEmail } from '@/lib/email-course-notifications';
import { logger } from '@/lib/logger';
import { withApiAudit } from '@/lib/audit/withApiAudit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function _GET(request: Request) {
  
    const rateLimited = await applyRateLimit(request, 'api');
    if (rateLimited) return rateLimited;
const auth = const auth = await apiRequireAdmin(req);
  if (auth.error) return auth.error;
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('course_id') || undefined;
    const userId = searchParams.get('user_id') || undefined;
    const status = searchParams.get('status') || undefined;
    const data = await listEnrollments({ courseId, userId, status });
    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function _POST(request: Request) {
    const rateLimited = await applyRateLimit(request, 'api');
    if (rateLimited) return rateLimited;

  const auth = const auth = await apiRequireAdmin(req);
  if (auth.error) return auth.error;
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  try {
    const body = await request.json().catch(() => null);
    const parsed = EnrollmentCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
    }
    const data = await createEnrollment(parsed.data);

    // Send enrollment confirmation email (fire-and-forget)
    sendCourseEnrollmentEmail({
      studentEmail: parsed.data.email || '',
      studentName: parsed.data.studentName || 'Student',
      courseName: parsed.data.courseName || 'Course',
      courseSlug: parsed.data.courseSlug || '',
      enrollmentDate: new Date().toISOString(),
    }).catch((err) => logger.error('Failed to send enrollment email', err));

    return NextResponse.json({ data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
export const GET = withApiAudit('/api/admin/enrollments', _GET);
export const POST = withApiAudit('/api/admin/enrollments', _POST);
