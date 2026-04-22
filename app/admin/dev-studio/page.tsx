import { requireRole } from '@/lib/auth/require-role';
import { DevStudioPageClient } from './DevStudioPageClient';

export const dynamic = 'force-dynamic';

export default async function DevStudioPage() {
  await requireRole(['admin', 'super_admin', 'staff']);
  return <DevStudioPageClient />;
}
