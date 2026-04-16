import AdminClientPage from '@/components/admin/AdminClientPage';
import VideoManagerClient from './VideoManagerClient';

export const dynamic = 'force-static';
export const revalidate = 3600;

export default function Page() {
  return (
    <AdminClientPage>
      <VideoManagerClient />
    </AdminClientPage>
  );
}
