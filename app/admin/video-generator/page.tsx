import AdminClientPage from '@/components/admin/AdminClientPage';
import VideoGeneratorClient from './VideoGeneratorClient';

export const dynamic = 'force-static';
export const revalidate = 3600;

export default function Page() {
  return (
    <AdminClientPage>
      <VideoGeneratorClient />
    </AdminClientPage>
  );
}
