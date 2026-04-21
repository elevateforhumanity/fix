import { Metadata } from 'next';
import { requireRole } from '@/lib/auth/require-role';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export const dynamic = "force-dynamic";
export const revalidate = 0;

import {
  AlertTriangle,
  FileText,
  Users,
  GraduationCap,
  TrendingUp,
  Download,
  Shield,
  BookOpen,
  Award,
  CheckCircle2,
} from 'lucide-react';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Accreditation Readiness | Admin',
  description: 'Monitor accreditation compliance and readiness status',
};

export default async function AccreditationPage() {
  await requireRole(['admin', 'super_admin']);
  const supabase = await createClient();

  const { data: programs } = await supabase
    .from('programs')
    .select('*')
    .eq('status', 'active');

  const { data: enrollments } = await supabase
    .from('program_enrollments')
    .select('*, program:programs(name, title)')
    .gte('created_at', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString());

  const { data: completions } = await supabase
    .from('program_enrollments')
    .select('*')
    .eq('status', 'completed')
    .gte(
      'completed_at',
      new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()
    );

  const { data: placements } = await supabase
    .from('job_placements')
    .select('*')
    .gte(
      'placement_date',
      new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()
    );

  const completionRate = enrollments?.length
    ? Math.round(((completions?.length || 0) / enrollments.length) * 100)
    : 0;

  const placementRate = completions?.length
    ? Math.round(((placements?.length || 0) / completions.length) * 100)
    : 0;

  // Accreditation readiness — sourced from accreditation_readiness view (migration 20260625000003).
  // Falls back gracefully if the migration has not been applied yet.
  const { data: readinessRows } = await supabase
    .from('accreditation_readiness')
    .select('category, standard_id, name, required, admin_link, sort_order, status, accepted_evidence_count')
    .order('sort_order', { ascending: true });

  const { data: summaryRows } = await supabase
    .rpc('get_accreditation_readiness_summary')
    .maybeSingle();

  const readinessSummary = summaryRows as {
    total_required: number;
    total_complete: number;
    total_pending: number;
    total_missing: number;
    readiness_score: number;
    last_review_date: string | null;
  } | null;

  // Group standards by category for display
  const standardsByCategory: Record<string, typeof readinessRows> = {};
  for (const row of (readinessRows ?? [])) {
    if (!standardsByCategory[row.category]) standardsByCategory[row.category] = [];
    standardsByCategory[row.category]!.push(row);
  }
  const hasAccreditationData = (readinessRows ?? []).length > 0;

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Image */}
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Accreditation' }]} />
          <div className="flex items-center justify-between mt-4">
            <div>
              <h1 className="text-3xl font-bold text-black">
                Accreditation Readiness
              </h1>
              <p className="text-black mt-1">
                Monitor compliance and prepare for accreditation
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/admin/accreditation/report"
                className="flex items-center gap-2 px-4 py-2 bg-brand-blue-600 text-white rounded-lg hover:bg-brand-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download Report</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Readiness Score */}
        <div className="bg-slate-900 rounded-lg p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Overall Readiness Score</h2>
              {hasAccreditationData && readinessSummary ? (
                <>
                  <p className="text-slate-300 text-sm">
                    {readinessSummary.total_complete} of {readinessSummary.total_required} required standards complete
                    {readinessSummary.total_pending > 0 && ` · ${readinessSummary.total_pending} pending evidence`}
                    {readinessSummary.total_missing > 0 && ` · ${readinessSummary.total_missing} missing`}
                  </p>
                  {readinessSummary.last_review_date && (
                    <p className="text-slate-400 text-xs mt-1">
                      Last reviewed: {new Date(readinessSummary.last_review_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-slate-400 text-sm mt-1">
                  Apply migration 20260625000003 and add evidence to enable readiness scoring.
                </p>
              )}
            </div>
            <div className="text-center">
              {hasAccreditationData && readinessSummary ? (
                <>
                  <div className={`text-6xl font-black ${
                    readinessSummary.readiness_score >= 90 ? 'text-brand-green-400' :
                    readinessSummary.readiness_score >= 70 ? 'text-yellow-400' : 'text-rose-400'
                  }`}>
                    {readinessSummary.readiness_score}%
                  </div>
                  <div className="text-slate-400 mt-2 text-sm">
                    {readinessSummary.readiness_score >= 90 ? 'Ready' :
                     readinessSummary.readiness_score >= 70 ? 'Nearly ready' : 'In progress'}
                  </div>
                </>
              ) : (
                <>
                  <div className="text-4xl font-bold text-slate-500">—</div>
                  <div className="text-slate-500 mt-2 text-sm">Not configured</div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <GraduationCap className="w-8 h-8 text-brand-blue-600" />
              <span className="text-2xl font-bold text-black">
                {programs?.length || 0}
              </span>
            </div>
            <h3 className="text-sm font-medium text-black">
              Active Programs
            </h3>
            <p className="text-xs text-black mt-1">
              All with documented outcomes
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-brand-green-600" />
              <span className="text-2xl font-bold text-black">
                {enrollments?.length || 0}
              </span>
            </div>
            <h3 className="text-sm font-medium text-black">
              Annual Enrollments
            </h3>
            <p className="text-xs text-black mt-1">Last 12 months</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <Award className="w-8 h-8 text-brand-blue-600" />
              <span className="text-2xl font-bold text-black">
                {completionRate}%
              </span>
            </div>
            <h3 className="text-sm font-medium text-black">
              Completion Rate
            </h3>
            <p className="text-xs text-black mt-1">Target: 75%+</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-brand-orange-600" />
              <span className="text-2xl font-bold text-black">
                {placementRate}%
              </span>
            </div>
            <h3 className="text-sm font-medium text-black">
              Placement Rate
            </h3>
            <p className="text-xs text-black mt-1">Target: 80%+</p>
          </div>
        </div>

        {/* Compliance Checklist */}
        {!hasAccreditationData ? (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <AlertTriangle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Accreditation checklist not configured</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Apply migration <code className="bg-gray-100 px-1 rounded text-xs">20260625000003_accreditation_system.sql</code> in the Supabase Dashboard to enable the checklist and readiness scoring.
            </p>
            <Link
              href="/admin/accreditation/report"
              className="inline-flex items-center gap-2 mt-6 px-4 py-2 bg-brand-blue-600 text-white rounded-lg hover:bg-brand-blue-700 transition-colors text-sm"
            >
              <FileText className="w-4 h-4" />
              View Accreditation Report
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(standardsByCategory).map(([category, standards]) => (
              <div key={category} className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">{category}</h3>
                  <span className="text-xs text-slate-500">
                    {(standards ?? []).filter((s: any) => s.status === 'complete').length} / {(standards ?? []).length} complete
                  </span>
                </div>
                <div className="p-6 space-y-3">
                  {(standards ?? []).map((std: any) => (
                    <div key={std.standard_id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        {std.status === 'complete' ? (
                          <BookOpen className="w-4 h-4 text-brand-green-500 flex-shrink-0" />
                        ) : std.status === 'pending' ? (
                          <Shield className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                        )}
                        <div>
                          <span className="font-medium text-slate-900 text-sm">{std.name}</span>
                          {!std.required && <span className="ml-2 text-xs text-slate-400">(optional)</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          std.status === 'complete' ? 'bg-brand-green-100 text-brand-green-700' :
                          std.status === 'pending'  ? 'bg-yellow-100 text-yellow-700' :
                          'bg-rose-100 text-rose-700'
                        }`}>
                          {std.status === 'complete' ? 'Complete' : std.status === 'pending' ? 'Pending evidence' : 'Missing'}
                        </span>
                        {std.admin_link && (
                          <Link href={std.admin_link} className="text-brand-blue-600 hover:text-brand-blue-700 text-xs font-medium">
                            View →
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Missing standards — action required */}
            {readinessSummary && readinessSummary.total_missing > 0 && (
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-rose-900 mb-1">
                      {readinessSummary.total_missing} required standard{readinessSummary.total_missing !== 1 ? 's' : ''} missing evidence
                    </h3>
                    <p className="text-rose-700 text-sm">
                      Upload evidence documents or add attestations to move these standards to complete.
                    </p>
                    <Link
                      href="/admin/accreditation/evidence"
                      className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 text-sm font-medium"
                    >
                      <FileText className="w-4 h-4" />
                      Manage Evidence
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Resources */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Link
            href="/compliance"
            className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
          >
            <Shield className="w-8 h-8 text-brand-blue-600 mb-3" />
            <h3 className="text-lg font-semibold text-black mb-2">
              Compliance Documentation
            </h3>
            <p className="text-sm text-black">
              Complete COE standards compliance framework
            </p>
          </Link>

          <Link
            href="/syllabi"
            className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
          >
            <BookOpen className="w-8 h-8 text-brand-green-600 mb-3" />
            <h3 className="text-lg font-semibold text-black mb-2">
              Course Syllabi
            </h3>
            <p className="text-sm text-black">
              Learning outcomes and assessment methods
            </p>
          </Link>

          <Link
            href="/student-handbook"
            className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
          >
            <FileText className="w-8 h-8 text-brand-blue-600 mb-3" />
            <h3 className="text-lg font-semibold text-black mb-2">
              Student Handbook
            </h3>
            <p className="text-sm text-black">
              Policies, procedures, and student rights
            </p>
          </Link>
        </div>

        {/* COE Contact */}
        <div className="mt-8 bg-brand-blue-50 border border-brand-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-brand-blue-900 mb-3">
            Council on Occupational Education (COE)
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-brand-blue-800">
            <div>
              <p className="font-medium mb-1">Address:</p>
              <p>7840 Roswell Road, Building 300, Suite 325</p>
              <p>Atlanta, GA 30350</p>
            </div>
            <div>
              <p className="font-medium mb-1">Contact:</p>
              <p>Phone: (770) 396-3898</p>
              <p>Email: info@council.org</p>
              <p>Website: www.council.org</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
