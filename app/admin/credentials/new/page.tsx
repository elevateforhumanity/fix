import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import CredentialForm from '../CredentialForm';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'New Credential | Admin' };

export default async function NewCredentialPage() {
  const supabase = await createClient();
  const db = await getAdminClient();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { label: 'Admin', href: '/admin' },
          { label: 'Credential Registry', href: '/admin/credentials' },
          { label: 'New Credential' },
        ]} />
        <h1 className="text-2xl font-bold text-slate-900 mt-6 mb-8">Add Credential</h1>
        <CredentialForm mode="create" />
      </div>
    </div>
  );
}
