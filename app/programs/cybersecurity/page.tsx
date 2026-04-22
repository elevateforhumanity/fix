import { requireRole } from '@/lib/auth/require-role';
import { getEnrollmentCount } from '@/lib/programs/getEnrollmentCount';
import { CybersecurityProgramPageClient } from './CybersecurityProgramPageClient';

export const dynamic = 'force-dynamic';

export default async function CybersecurityProgramPage() {
  const enrollmentCount = await getEnrollmentCount('cybersecurity');
  return <CybersecurityProgramPageClient enrollmentCount={enrollmentCount} />;
}
