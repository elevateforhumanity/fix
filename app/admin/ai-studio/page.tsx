import AdminClientPage from '@/components/admin/AdminClientPage';
import AIStudioClient from './AIStudioClient';

export const dynamic = 'force-static';
export const revalidate = 3600;

export default function Page() {
  return (
    <AdminClientPage>
      <AIStudioClient />
    </AdminClientPage>
  );
}
