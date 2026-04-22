import { requireRole } from '@/lib/auth/require-role';
import { getEnrollmentCount } from '@/lib/programs/getEnrollmentCount';
import { ElectricalProgramPageClient } from './ElectricalProgramPageClient';

export const dynamic = 'force-dynamic';

export default async function ElectricalProgramPage() {
  const enrollmentCount = await getEnrollmentCount('electrical');
  return <ElectricalProgramPageClient enrollmentCount={enrollmentCount} />;
}
