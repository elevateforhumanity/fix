import { NextResponse } from 'next/server';
import { applyRateLimit } from '@/lib/api/withRateLimit';
import { withApiAudit } from '@/lib/audit/withApiAudit';

export const dynamic = 'force-dynamic';

async function _GET(request: Request) {
  try {
    const rateLimited = await applyRateLimit(request, 'api');
    if (rateLimited) return rateLimited;

    const auth = await apiRequireAdmin(req);
  if (auth.error) return auth.error;

      }

    const { count: programCount } = await supabase
      .from('programs')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    const { count: courseCount } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published');

    const { count: enrollmentCount } = await supabase
      .from('program_enrollments')
      .select('*', { count: 'exact', head: true })
      .in('status', ['active', 'completed']);

    const { data: categories } = await supabase
      .from('programs')
      .select('category')
      .eq('status', 'active');

    const uniqueCategories = [...new Set(categories?.map(c => c.category).filter(Boolean))];

    return NextResponse.json({
      totalPrograms: programCount || 0,
      totalCourses: courseCount || 0,
      totalEnrollments: enrollmentCount || 0,
      categories: uniqueCategories,
      generatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
export const GET = withApiAudit('/api/admin/catalog/summary', _GET);
