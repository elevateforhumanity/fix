import { requireRole } from '@/lib/auth/require-role';
import { CourseBuilderPageClient } from './CourseBuilderPageClient';

export const dynamic = 'force-dynamic';

export default async function CourseBuilderPage() {
  await requireRole(['admin', 'super_admin', 'staff']);
  return <CourseBuilderPageClient />;
}
