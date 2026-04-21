import { Metadata } from 'next';
import { requireRole } from '@/lib/auth/require-role';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { 
  Shield, FileText, Users, AlertTriangle, 
  Clock, Download, Eye, Search, Filter
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'FERPA Compliance | Admin | Elevate For Humanity',
  description: 'Manage FERPA compliance, student records access, and privacy controls.',
};

export default async function AdminFerpaPage() {
  await requireRole(['admin', 'super_admin', 'staff']);
  const supabase = await createClient();

  // Query real counts from documents table (consent forms are documents)
  const { count: consentCount } = await supabase.from('documents').select('*', { count: 'exact', head: true }).eq('document_type', 'consent');
  const { count: pendingDocs } = await supabase.from('documents').select('*', { count: 'exact', head: true }).eq('status', 'pending');
  const { count: totalStudents } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student');

  // FERPA violations YTD — sourced from compliance_alerts
  const ytdStart = new Date(new Date().getFullYear(), 0, 1).toISOString();
  const { count: ferpaViolations } = await supabase
    .from('compliance_alerts')
    .select('*', { count: 'exact', head: true })
    .eq('alert_type', 'ferpa_violation')
    .gte('created_at', ytdStart);

  const complianceStats = [
    { label: 'Active Consent Forms', value: String(consentCount || 0), icon: FileText, color: 'green' },
    { label: 'Pending Reviews', value: String(pendingDocs || 0), icon: Clock, color: 'yellow' },
    { label: 'Student Records', value: String(totalStudents || 0), icon: Eye, color: 'blue' },
    { label: 'Violations (YTD)', value: String(ferpaViolations ?? 0), icon: AlertTriangle, color: (ferpaViolations ?? 0) > 0 ? 'red' : 'green' },
  ];

  // Query recent audit activity
  const { data: auditLogs } = await supabase
    .from('audit_logs')
    .select('action, target_type, created_at, actor_id')
    .order('created_at', { ascending: false })
    .limit(5);

  const recentActivity = (auditLogs || []).map((log: any) => ({
    action: log.action || 'Activity',
    student: log.target_type || 'Record',
    date: log.created_at ? new Date(log.created_at).toLocaleDateString() : '',
    status: 'complete',
  }));

  // FERPA compliance checklist — query from DB if records exist
  const { data: checklistRows } = await supabase
    .from('ferpa_compliance_checklist')
    .select('checklist_type, academic_year, items, completion_percentage, status, reviewed_at')
    .order('created_at', { ascending: false })
    .limit(1);
  const latestChecklist = checklistRows?.[0] ?? null;

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Image */}
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <Breadcrumbs items={[
            { label: 'Admin', href: '/admin' },
            { label: 'FERPA Compliance' }
          ]} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <Shield className="w-8 h-8 text-brand-blue-600" />
              FERPA Compliance Dashboard
            </h1>
            <p className="text-slate-700 mt-1">
              Manage student privacy, consent forms, and records access
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/ferpa"
              className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 text-slate-900 font-medium"
            >
              Audit Log
            </Link>
            <Link
              href="/admin/ferpa/training"
              className="px-4 py-2 bg-brand-blue-600 text-white rounded-lg hover:bg-brand-blue-700 font-medium"
            >
              Staff Training
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {complianceStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`w-8 h-8 ${
                  stat.color === 'green' ? 'text-brand-green-600' :
                  stat.color === 'yellow' ? 'text-yellow-600' :
                  stat.color === 'blue' ? 'text-brand-blue-600' : 'text-slate-700'
                }`} />
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  stat.color === 'green' ? 'bg-brand-green-100 text-brand-green-700' :
                  stat.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                  stat.color === 'blue' ? 'bg-brand-blue-100 text-brand-blue-700' : 'bg-gray-100 text-slate-900'
                }`}>
                  {stat.color === 'green' ? 'Good' : stat.color === 'yellow' ? 'Action Needed' : 'Info'}
                </span>
              </div>
              <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
              <div className="text-slate-700 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h2 className="font-semibold text-slate-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  href="/admin/ferpa"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FileText className="w-5 h-5 text-brand-blue-600" />
                  <span className="text-slate-900">Manage Consent Forms</span>
                </Link>
                <Link
                  href="/admin/ferpa"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Eye className="w-5 h-5 text-brand-blue-600" />
                  <span className="text-slate-900">Review Access Requests</span>
                </Link>
                <Link
                  href="/admin/ferpa"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Users className="w-5 h-5 text-brand-green-600" />
                  <span className="text-slate-900">Directory Information</span>
                </Link>
                <Link
                  href="/admin/ferpa"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-5 h-5 text-brand-orange-600" />
                  <span className="text-slate-900">Generate Reports</span>
                </Link>
              </div>
            </div>

            {/* Compliance Checklist — DB-driven */}
            <div className="bg-white rounded-xl p-6 shadow-sm border mt-6">
              <h2 className="font-semibold text-slate-900 mb-4">Annual Compliance</h2>
              {latestChecklist ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-500">{latestChecklist.academic_year}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      latestChecklist.status === 'complete' ? 'bg-brand-green-100 text-brand-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>{latestChecklist.completion_percentage ?? 0}% complete</span>
                  </div>
                  {latestChecklist.reviewed_at && (
                    <p className="text-xs text-slate-500">Last reviewed: {new Date(latestChecklist.reviewed_at).toLocaleDateString()}</p>
                  )}
                  {Array.isArray(latestChecklist.items) && latestChecklist.items.map((item: any, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                      {item.completed ? (
                        <span className="text-brand-green-500 flex-shrink-0">✓</span>
                      ) : (
                        <Clock className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                      )}
                      <span className="text-slate-900 text-sm">{item.name ?? item.label ?? item}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No compliance checklist on record. Create one in the FERPA compliance module.</p>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-slate-900">Recent Activity</h2>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                      <input
                        type="text"
                        placeholder="Search..."
                        className="pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
                      />
                    </div>
                    <button className="p-2 border rounded-lg hover:bg-gray-50">
                      <Filter className="w-4 h-4 text-slate-700" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="divide-y">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-slate-900">{activity.action}</div>
                        <div className="text-sm text-slate-700">Student: {activity.student}</div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          activity.status === 'complete' ? 'bg-brand-green-100 text-brand-green-700' :
                          activity.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-brand-blue-100 text-brand-blue-700'
                        }`}>
                          {activity.status}
                        </span>
                        <div className="text-sm text-slate-700 mt-1">{activity.date}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t">
                <Link
                  href="/admin/ferpa"
                  className="text-brand-blue-600 hover:text-brand-blue-700 text-sm font-medium"
                >
                  View All Activity →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
