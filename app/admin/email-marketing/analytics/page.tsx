// Server component — enforces admin auth at the route boundary.
// The client component never renders for unauthorized users.
import AdminClientPage from '@/components/admin/AdminClientPage';
import EmailAnalyticsClient from './EmailAnalyticsClient';

export const dynamic = 'force-static';
export const revalidate = 3600;

export default function Page() {
  return (
    <AdminClientPage>
      <EmailAnalyticsClient />
    </AdminClientPage>
  );
}
