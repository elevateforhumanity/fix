import { requireRole } from '@/lib/auth/require-role';
import { getEnrollmentCount } from '@/lib/programs/getEnrollmentCount';
import { PlumbingProgramPageClient } from './PlumbingProgramPageClient';

export const dynamic = 'force-dynamic';

export default async function PlumbingProgramPage() {
  const enrollmentCount = await getEnrollmentCount('plumbing');
  return <PlumbingProgramPageClient enrollmentCount={enrollmentCount} />;
}
