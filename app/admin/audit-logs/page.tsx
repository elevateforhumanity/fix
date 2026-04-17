import type { Metadata } from 'next';
import { getAdminClient } from '@/lib/supabase/admin';
import { Shield } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Audit Logs | Admin | Elevate For Humanity',
  robots: { index: false, follow: false },
};

const ACTION_STYLES: Record<string, string> = {
  create: 'bg-green-100 text-green-700',
  update: 'bg-blue-100 text-blue-700',
  delete: 'bg-red-100 text-red-700',
  login:  'bg-slate-100 text-slate-700',
  export: 'bg-yellow-100 text-yellow-700',
};

export default async function AuditLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ action?: string; resource?: string; page?: string }>;
}) {
  const params = await searchParams;
  const db = await getAdminClient();
  const page = Math.max(1, parseInt(params.page ?? '1', 10));
  const pageSize = 50;
  const offset = (page - 1) * pageSize;

  let query = db
    .from('audit_logs')
    .select('id,user_id,action,resource_type,resource_id,created_at,metadata', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (params.action) query = query.eq('action', params.action);
  if (params.resource) query = query.eq('resource_type', params.resource);

  const { data: logs, count } = await query;
  const total = count ?? 0;
  const totalPages = Math.ceil(total / pageSize);

  function fmt(iso: string) {
    return new Date(iso).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit',
    });
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-slate-400" />
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Audit Logs</h1>
              <p className="text-slate-500 text-sm">{total.toLocaleString()} total events</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl border overflow-hidden">
          {!logs || logs.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <Shield className="w-12 h-12 mx-auto mb-3 text-slate-200" />
              <p>No audit log entries found.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50">
                <tr>
                  {['Time', 'Action', 'Resource', 'Resource ID', 'User'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 text-sm">
                    <td className="px-6 py-3 text-slate-500 whitespace-nowrap">{fmt(log.created_at)}</td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${ACTION_STYLES[log.action] ?? 'bg-slate-100 text-slate-600'}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-slate-700">{log.resource_type}</td>
                    <td className="px-6 py-3 text-slate-400 font-mono text-xs">{log.resource_id ?? '—'}</td>
                    <td className="px-6 py-3 text-slate-400 font-mono text-xs truncate max-w-[160px]">{log.user_id ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 text-sm text-slate-500">
            <span>Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              {page > 1 && (
                <a href={`?page=${page - 1}`} className="px-3 py-1.5 border rounded-lg hover:bg-slate-50">Previous</a>
              )}
              {page < totalPages && (
                <a href={`?page=${page + 1}`} className="px-3 py-1.5 border rounded-lg hover:bg-slate-50">Next</a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
