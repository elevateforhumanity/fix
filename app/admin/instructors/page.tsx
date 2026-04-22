import { requireRole } from '@/lib/auth/require-role';
import { InstructorsPageClient } from './InstructorsPageClient';

export const dynamic = 'force-dynamic';

export default async function InstructorsPage() {
  await requireRole(['admin', 'super_admin', 'staff']);
  return <InstructorsPageClient />;
}
