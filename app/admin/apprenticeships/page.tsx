import { requireRole } from '@/lib/auth/require-role';
import { AdminApprenticeshipsClient } from './AdminApprenticeshipsClient';

export const dynamic = 'force-dynamic';

export default async function AdminApprenticeships() {
  await requireRole(['admin', 'super_admin', 'staff']);
  return <AdminApprenticeshipsClient />;
}
