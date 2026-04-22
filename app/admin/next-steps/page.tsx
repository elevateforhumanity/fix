import { requireRole } from '@/lib/auth/require-role';
import { AdminNextStepsPageClient } from './AdminNextStepsPageClient';

export const dynamic = 'force-dynamic';

export default async function AdminNextStepsPage() {
  await requireRole(['admin', 'super_admin', 'staff']);
  return <AdminNextStepsPageClient />;
}
