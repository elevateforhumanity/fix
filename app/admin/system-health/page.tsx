import { Metadata } from 'next';
import { requireRole } from '@/lib/auth/require-role';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://www.elevateforhumanity.org/admin/system-health',
  },
  title: 'System Health | Elevate For Humanity',
  description: 'Monitor system health and status.',
};

export default async function SystemHealthPage() {
  await requireRole(['admin', 'super_admin']);
  const supabase = await createClient();

  // Job queue health — pending/failed jobs are real system signals
  const { count: pendingJobs } = await supabase
    .from('job_queue')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  const { count: failedJobs } = await supabase
    .from('job_queue')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'failed');

  const { count: processingJobs } = await supabase
    .from('job_queue')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'processing');

  // Recent failed jobs for detail
  const { data: recentFailed } = await supabase
    .from('job_queue')
    .select('id, type, last_error, created_at')
    .eq('status', 'failed')
    .order('created_at', { ascending: false })
    .limit(10);

  // Audit log activity as a proxy for system activity
  const { count: auditCount24h } = await supabase
    .from('audit_logs')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

  const { count: unresolvedAlerts } = await supabase
    .from('compliance_alerts')
    .select('*', { count: 'exact', head: true })
    .eq('resolved', false);

  const jobQueueHealthy = (failedJobs ?? 0) === 0;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'System Health' }]} />
      </div>

      <section className="relative h-48 md:h-64 overflow-hidden">
        <Image
          src="/images/pages/admin-system-health-hero.jpg"
          alt="System Health"
          fill
          className="object-cover"
          quality={100}
          priority
          sizes="100vw"
        />
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">System Health</h1>
            <p className="text-slate-700 mt-1">Live indicators from job queue, audit logs, and compliance alerts.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-sm font-medium text-slate-700 mb-2">Pending Jobs</h3>
              <p className="text-3xl font-bold text-brand-blue-600">{pendingJobs ?? 0}</p>
              <p className="text-xs text-slate-500 mt-1">In job_queue</p>
            </div>
            <div className={`bg-white rounded-lg shadow-sm border p-6 ${(failedJobs ?? 0) > 0 ? 'border-red-300' : ''}`}>
              <h3 className="text-sm font-medium text-slate-700 mb-2">Failed Jobs</h3>
              <p className={`text-3xl font-bold ${(failedJobs ?? 0) > 0 ? 'text-red-600' : 'text-brand-green-600'}`}>
                {failedJobs ?? 0}
              </p>
              <p className="text-xs text-slate-500 mt-1">{jobQueueHealthy ? 'No failures' : 'Requires attention'}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-sm font-medium text-slate-700 mb-2">Processing Now</h3>
              <p className="text-3xl font-bold text-brand-blue-600">{processingJobs ?? 0}</p>
              <p className="text-xs text-slate-500 mt-1">Active jobs</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-sm font-medium text-slate-700 mb-2">Audit Events (24h)</h3>
              <p className="text-3xl font-bold text-slate-900">{auditCount24h ?? 0}</p>
              <p className="text-xs text-slate-500 mt-1">From audit_logs</p>
            </div>
            <div className={`bg-white rounded-lg shadow-sm border p-6 ${(unresolvedAlerts ?? 0) > 0 ? 'border-yellow-300' : ''}`}>
              <h3 className="text-sm font-medium text-slate-700 mb-2">Unresolved Compliance Alerts</h3>
              <p className={`text-3xl font-bold ${(unresolvedAlerts ?? 0) > 0 ? 'text-yellow-600' : 'text-brand-green-600'}`}>
                {unresolvedAlerts ?? 0}
              </p>
              <p className="text-xs text-slate-500 mt-1">From compliance_alerts</p>
            </div>
          </div>

          {(recentFailed ?? []).length > 0 ? (
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b">
                <h2 className="font-semibold text-slate-900">Recent Failed Jobs</h2>
              </div>
              <div className="divide-y">
                {(recentFailed ?? []).map((job: any) => (
                  <div key={job.id} className="px-6 py-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-slate-900 text-sm">{job.type}</p>
                        {job.last_error && (
                          <p className="text-xs text-red-600 mt-1 font-mono">{job.last_error}</p>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">
                        {job.created_at ? new Date(job.created_at).toLocaleString() : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-brand-green-50 border border-brand-green-200 rounded-lg p-6 text-center">
              <p className="text-brand-green-800 font-medium">No failed jobs — job queue is healthy.</p>
            </div>
          )}

          <div className="mt-8 flex gap-4">
            <Link
              href="/admin/system/jobs"
              className="px-6 py-3 bg-brand-blue-600 text-white rounded-lg font-semibold hover:bg-brand-blue-700"
            >
              View Job Queue
            </Link>
            <Link
              href="/admin/reports"
              className="px-6 py-3 bg-white border text-slate-900 rounded-lg font-semibold hover:bg-gray-50"
            >
              View Reports
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
