import { requireRole } from '@/lib/auth/require-role';
import { getEnrollmentCount } from '@/lib/programs/getEnrollmentCount';
import { MedicalAssistantProgramPageClient } from './MedicalAssistantProgramPageClient';

export const dynamic = 'force-dynamic';

export default async function MedicalAssistantProgramPage() {
  const enrollmentCount = await getEnrollmentCount('medical-assistant');
  return <MedicalAssistantProgramPageClient enrollmentCount={enrollmentCount} />;
}
