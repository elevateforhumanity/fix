import { requireRole } from '@/lib/auth/require-role';
import { getAdminClient } from '@/lib/supabase/admin';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Shield, FileText } from 'lucide-react';

export const dynamic = 'force-dynamic';

// FERPA-relevant action prefixes in audit_logs
const FERPA_ACTIONS = [
  'ferpa',
  'record_access',
  'record_disclosure',
  'consent',
  'directory_info',
  'education_record',
];

export default async function FerpaAuditLogPage() {
  await requireRole(['admin', 'super_admin', 'staff']);
  const db = await getAdminClient();

  // Pull audit_logs rows whose action starts with a FERPA-relevant prefix
  // Supabase doesn't support OR-ilike natively in one call, so we filter client-side
  // after fetching recent logs (capped at 200 to keep it fast).
  const { data: allLogs } = await db
    .from('audit_logs')
    .select('id, action, actor_id, target_type, target_id, metadata, created_at, profiles(full_name, email)')
    .order('created_at', { ascending: false })
    .limit(200);

  const logs = (allLogs ?? []).filter((log: any) =>
    FERPA_ACTIONS.some((prefix) =>
      (log.action ?? '').toLowerCase().startsWith(prefix)
    )
  );

  // Also pull ferpa_access_logs as a dedicated source
  const { data: accessLogs } = await db
    .from('ferpa_access_logs')
    .select('id, action, record_type, justification, created_at, user_id, profiles(full_name, email)')
    .order('created_at', { ascending: false })
    .limit(100);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumbs
          items={[
            { label: 'Admin', href: '/admin' },
            { label: 'FERPA', href: '/admin/ferpa' },
            { label: 'Audit Log' },
          ]}
        />

        <div className="mt-6 mb-8">
          <h1 className="text-2xl font-bold text-slate-900">FERPA Audit Log</h1>
          <p className="text-slate-600 mt-1">
            Compliance audit trail for all education record access and disclosure events.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-5 h-5 text-brand-blue-600" />
              <span className="text-sm font-medium text-slate-600">FERPA Audit Events</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{logs.length}</p>
            <p className="text-xs text-slate-400 mt-1">From audit_logs (last 200)</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-slate-500" />
              <span className="text-sm font-medium text-slate-600">Record Access Events</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{accessLogs?.length ?? 0}</p>
            <p className="text-xs text-slate-400 mt-1">From ferpa_access_logs</p>
          </div>
        </div>

        {/* FERPA Access Logs */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Record Access Events</h2>
          </div>
          {!accessLogs?.length ? (
            <div className="py-10 text-center text-sm text-slate-400">No record access events logged.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="text-left py-3 px-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">User</th>
                    <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Action</th>
                    <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Record Type</th>
                    <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Justification</th>
                    <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {accessLogs.map((log: any) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-5">
                        <p className="font-medium text-slate-900">{log.profiles?.full_name ?? '—'}</p>
                        <p className="text-xs text-slate-400">{log.profiles?.email ?? ''}</p>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 text-xs font-mono">{log.action}</td>
                      <td className="py-3.5 px-4 text-slate-600 text-xs">{log.record_type ?? '—'}</td>
                      <td className="py-3.5 px-4 text-slate-500 text-xs max-w-[200px] truncate">
                        {log.justification ?? '—'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-xs">
                        {log.created_at ? new Date(log.created_at).toLocaleString() : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* General FERPA audit events from audit_logs */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">FERPA System Events</h2>
          </div>
          {!logs.length ? (
            <div className="py-10 text-center text-sm text-slate-400">No FERPA system events in audit log.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="text-left py-3 px-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Actor</th>
                    <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Action</th>
                    <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Target</th>
                    <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {logs.map((log: any) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-5">
                        <p className="font-medium text-slate-900">{log.profiles?.full_name ?? '—'}</p>
                        <p className="text-xs text-slate-400">{log.profiles?.email ?? ''}</p>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 text-xs font-mono">{log.action}</td>
                      <td className="py-3.5 px-4 text-slate-500 text-xs">
                        {log.target_type ? `${log.target_type} ${log.target_id ?? ''}` : '—'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-xs">
                        {log.created_at ? new Date(log.created_at).toLocaleString() : '—'}
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
