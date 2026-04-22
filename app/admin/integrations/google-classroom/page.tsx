import { Metadata } from 'next';
import { requireRole } from '@/lib/auth/require-role';
import { getAdminClient } from '@/lib/supabase/admin';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import GoogleClassroomClient from './GoogleClassroomClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Google Classroom | Integrations | Admin',
  robots: { index: false, follow: false },
};

export default async function GoogleClassroomPage({
  searchParams,
}: {
  searchParams: Promise<{ connected?: string; error?: string }>;
}) {
  const { user } = await requireRole(['admin', 'super_admin']);
  const db = await getAdminClient();

  const { data: tokenRow } = await db
    .from('integration_tokens')
    .select('expires_at, updated_at')
    .eq('user_id', user.id)
    .eq('provider', 'google_classroom')
    .maybeSingle();

  const { connected: connectedParam, error: errorParam } = await searchParams;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Integrations', href: '/admin/integrations' },
          { label: 'Google Classroom' },
        ]} />

        <div className="mt-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center shadow-sm">
            <svg viewBox="0 0 48 48" className="w-7 h-7" fill="none">
              <rect width="48" height="48" rx="8" fill="#1A73E8"/>
              <path d="M14 16h20v16H14z" fill="white" opacity=".9"/>
              <path d="M24 20l8 6-8 6-8-6 8-6z" fill="#1A73E8"/>
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Google Classroom</h1>
            <p className="text-slate-500 text-sm">Sync courses, rosters, and assignments</p>
          </div>
        </div>

        <GoogleClassroomClient
          isConnected={!!tokenRow}
          connectedAt={tokenRow?.updated_at ?? null}
          flashConnected={connectedParam === '1'}
          flashError={errorParam ?? null}
        />
      </div>
    </div>
  );
}
