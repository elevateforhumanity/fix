import { requireRole } from '@/lib/auth/require-role';
import { getAdminClient } from '@/lib/supabase/admin';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import Link from 'next/link';
import { Inbox, Clock, CheckCircle, XCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

const STATUS_STYLES: Record<string, string> = {
  pending:  'bg-amber-100 text-amber-800',
  approved: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-red-100 text-red-800',
  reviewed: 'bg-blue-100 text-blue-800',
};

export default async function FerpaAccessRequestsPage() {
  await requireRole(['admin', 'super_admin', 'staff']);
  const db = await getAdminClient();

  const { data: requests, count } = await db
    .from('documents')
    .select('id, file_name, status, created_at, reviewed_at, user_id, profiles(full_name, email)', { count: 'exact' })
    .eq('document_type', 'access_request')
    .order('created_at', { ascending: false })
    .limit(50);

  const pendingCount  = requests?.filter((r: any) => r.status === 'pending').length ?? 0;
  const approvedCount = requests?.filter((r: any) => r.status === 'approved').length ?? 0;
  const rejectedCount = requests?.filter((r: any) => r.status === 'rejected').length ?? 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumbs
          items={[
            { label: 'Admin', href: '/admin' },
            { label: 'FERPA', href: '/admin/ferpa' },
            { label: 'Access Requests' },
          ]}
        />

        <div className="mt-6 mb-8">
          <h1 className="text-2xl font-bold text-slate-900">FERPA Access Requests</h1>
          <p className="text-slate-600 mt-1">
            Requests to inspect or obtain copies of student education records.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total', value: count ?? 0, icon: Inbox, color: 'text-slate-900' },
            { label: 'Pending', value: pendingCount, icon: Clock, color: 'text-amber-600' },
            { label: 'Approved', value: approvedCount, icon: CheckCircle, color: 'text-emerald-600' },
            { label: 'Rejected', value: rejectedCount, icon: XCircle, color: 'text-red-600' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-2">
                <s.icon className={`w-5 h-5 ${s.color}`} />
                <span className="text-sm font-medium text-slate-600">{s.label}</span>
              </div>
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">All Access Requests</h2>
            {pendingCount > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                {pendingCount} pending
              </span>
            )}
          </div>
          {!requests?.length ? (
            <div className="py-16 text-center">
              <Inbox className="w-8 h-8 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500">No access requests on file.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="text-left py-3 px-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Requestor</th>
                    <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">File</th>
                    <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                    <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Submitted</th>
                    <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Reviewed</th>
                    <th className="py-3 px-4" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {requests.map((req: any) => (
                    <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-5">
                        <p className="font-medium text-slate-900">{req.profiles?.full_name ?? '—'}</p>
                        <p className="text-xs text-slate-400">{req.profiles?.email ?? ''}</p>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 text-xs font-mono truncate max-w-[180px]">
                        {req.file_name ?? req.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${STATUS_STYLES[req.status] ?? 'bg-slate-100 text-slate-600'}`}>
                          {req.status ?? 'unknown'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-xs">
                        {req.created_at ? new Date(req.created_at).toLocaleDateString() : '—'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-xs">
                        {req.reviewed_at ? new Date(req.reviewed_at).toLocaleDateString() : '—'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/admin/documents/${req.id}`}
                          className="text-xs font-semibold text-brand-blue-600 hover:underline"
                        >
                          Review
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
