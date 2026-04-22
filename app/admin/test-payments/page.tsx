import { requireRole } from '@/lib/auth/require-role';
import { TestPaymentsPageClient } from './TestPaymentsPageClient';

export const dynamic = 'force-dynamic';

export default async function TestPaymentsPage() {
  await requireRole(['admin', 'super_admin', 'staff']);
  return <TestPaymentsPageClient />;
}
