import { Metadata } from 'next';
import { requireRole } from '@/lib/auth/require-role';
import { getAdminClient } from '@/lib/supabase/admin';
import Link from 'next/link';
import { Shield, AlertTriangle, CheckCircle, Clock, ChevronRight, ArrowRight, FileText, Users } from 'lucide-react';
import { CredentialVerificationPanel } from '@/components/admin/CredentialVerificationPanel';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Compliance | Admin | Elevate For Humanity',
};

const SEV_STYLES: Record<string, string> = {
  critical: 'bg-red-100 text-red-800 border-red-200',
  high:     'bg-orange-100 text-orange-800 border-orange-200',
  medium:   'bg-yellow-100 text-yellow-800 border-yellow-200',
  low:      'bg-slate-100 text-slate-600 border-slate-200',
};

export default async function CompliancePage() {
  await requireRole(['admin', 'super_admin']);
  const db = await getAdminClient();

  const ytdStart = new Date(new Date().getFullYear(), 0, 1).toISOString();

  const [alertsRes, resolvedYtdRes, ferpaRes, auditRes, documentsRes] = await Promise.all([
    db.from('compliance_alerts')
      .select('id, alert_type, severity, title, description, entity_type, created_at, status')
      .neq('status', 'resolved')
      .order('severity', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(50),
    db.from('compliance_alerts')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'resolved')
      .gte('created_at', ytdStart),
    db.from('compliance_alerts')
      .select('id', { count: 'exact', head: true })
      .eq('alert_type', 'ferpa_violation')
      .gte('created_at', ytdStart),
    db.from('audit_logs')
      .select('id, action, actor_id, target_type, resource_type, created_at, actor_role')
      .order('created_at', { ascending: false })
      .limit(20),
    db.from('documents')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending'),
  ]);

  const alerts        = alertsRes.data ?? [];
  const resolvedYtd   = resolvedYtdRes.count ?? 0;
  const ferpaViolations = ferpaRes.count ?? 0;
  const auditLogs     = auditRes.data ?? [];
  const criticalCount = alerts.filter((a: any) => a.severity === 'critical').length;
  const openCount     = alerts.length;

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b border-slate-200 px-6 py-5">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
          <Link href="/admin/dashboard" className="hover:text-slate-700">Admin</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-900 font-medium">Compliance</span>
        </nav>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-6 h-6 text-brand-blue-600" />
              Compliance Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-1">FERPA, WIOA, and DOL compliance monitoring</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/ferpa" className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">FERPA Log</Link>
            <Link href="/admin/wioa/documents" className="px-4 py-2 bg-brand-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-blue-700 transition-colors">WIOA Docs</Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Open Alerts',      value: openCount,       icon: AlertTriangle, urgent: openCount > 0,       color: 'text-rose-600',  bg: 'bg-rose-50',  href: '#alerts' },
            { label: 'Critical',         value: criticalCount,   icon: AlertTriangle, urgent: criticalCount > 0,   color: 'text-red-700',   bg: 'bg-red-50',   href: '#alerts' },
            { label: 'Resolved YTD',     value: resolvedYtd,     icon: CheckCircle,   urgent: false,               color: 'text-green-600', bg: 'bg-green-50', href: '#alerts' },
            { label: 'FERPA Violations', value: ferpaViolations, icon: Shield,        urgent: ferpaViolations > 0, color: 'text-amber-600', bg: 'bg-amber-50', href: '/admin/ferpa' },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <Link key={s.label} href={s.href}
                className={`bg-white rounded-2xl border shadow-sm p-5 hover:shadow-md transition-shadow ${s.urgent ? 'border-rose-300 ring-1 ring-rose-200' : 'border-slate-200'}`}>
                <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                  <Icon className={`w-4 h-4 ${s.color}`} />
                </div>
                <p className="text-2xl font-bold text-slate-900 tabular-nums">{s.value}</p>
                <p className="text-xs text-slate-500 mt-1 font-medium">{s.label}</p>
              </Link>
            );
          })}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'FERPA Compliance', href: '/admin/ferpa',            icon: Shield,   desc: 'Student privacy & consent' },
            { label: 'WIOA Documents',   href: '/admin/wioa/documents',   icon: FileText, desc: 'Federal funding docs' },
            { label: 'WIOA Eligibility', href: '/admin/wioa/eligibility', icon: Users,    desc: 'Participant eligibility' },
            { label: 'Audit Logs',       href: '/admin/audit-logs',       icon: Clock,    desc: 'Full activity trail' },
          ].map((l) => {
            const Icon = l.icon;
            return (
              <Link key={l.href} href={l.href}
                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:border-brand-blue-300 hover:shadow-sm transition-all group">
                <div className="w-9 h-9 rounded-lg bg-brand-blue-50 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-brand-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 group-hover:text-brand-blue-700 transition-colors">{l.label}</p>
                  <p className="text-xs text-slate-400">{l.desc}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-brand-blue-500 transition-colors ml-auto flex-shrink-0" />
              </Link>
            );
          })}
        </div>

        {/* Open alerts */}
        <div id="alerts" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Open Compliance Alerts</h2>
            <span className="text-xs text-slate-400">{openCount} unresolved</span>
          </div>
          {alerts.length === 0 ? (
            <div className="py-12 text-center">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No open compliance alerts</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {alerts.map((a: any) => (
                <div key={a.id} className="px-6 py-4 flex items-start gap-4 hover:bg-slate-50 transition-colors">
                  <span className={`mt-0.5 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${SEV_STYLES[a.severity] ?? SEV_STYLES.low}`}>
                    {(a.severity ?? 'low').toUpperCase()}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{a.title ?? a.alert_type ?? 'Alert'}</p>
                    {a.description && <p className="text-xs text-slate-500 mt-0.5 truncate">{a.description}</p>}
                    <p className="text-xs text-slate-400 mt-1">
                      {a.entity_type && <span className="mr-2">{a.entity_type}</span>}
                      {a.created_at && new Date(a.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                    a.status === 'open' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
                  }`}>{a.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Credential verification */}
        <CredentialVerificationPanel />

        {/* Recent audit activity */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Recent Audit Activity</h2>
            <Link href="/admin/audit-logs" className="text-xs font-semibold text-brand-blue-600 hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {auditLogs.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-400">No audit activity recorded</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {auditLogs.map((log: any) => (
                <div key={log.id} className="px-6 py-3 flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{log.action ?? 'Action'}</p>
                    <p className="text-xs text-slate-400">{log.resource_type ?? log.target_type ?? 'Record'} · {log.actor_role ?? 'user'}</p>
                  </div>
                  <p className="text-xs text-slate-400 flex-shrink-0 ml-4">
                    {log.created_at ? new Date(log.created_at).toLocaleString() : '—'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
