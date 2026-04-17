import { Metadata } from 'next';
import { requireRole } from '@/lib/auth/require-role';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { getAdminClient } from '@/lib/supabase/admin';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import TransitionButtons from './TransitionButtons';
import EligibilityReviewPanel from '@/components/admin/EligibilityReviewPanel';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Application Details | Elevate For Humanity',
  description: 'View application details',
};

const stateLabels: Record<string, string> = {
  started: 'Started',
  pending: 'Pending',
  submitted: 'Submitted',
  approved: 'Approved',
  rejected: 'Rejected',
  in_review: 'In Review',
  eligibility_complete: 'Eligibility Complete',
  documents_complete: 'Documents Complete',
  review_ready: 'Ready for Review',
};

const stateColors: Record<string, string> = {
  started: 'bg-gray-100 text-gray-800 border-gray-300',
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  submitted: 'bg-brand-blue-100 text-brand-blue-800 border-brand-blue-300',
  approved: 'bg-brand-green-100 text-brand-green-800 border-brand-green-300',
  rejected: 'bg-brand-red-100 text-brand-red-800 border-brand-red-300',
  in_review: 'bg-brand-blue-100 text-brand-blue-800 border-brand-blue-300',
  eligibility_complete: 'bg-brand-blue-100 text-brand-blue-800 border-brand-blue-300',
  documents_complete: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  review_ready: 'bg-yellow-100 text-yellow-800 border-yellow-300',
};

const typeLabels: Record<string, string> = {
  student: 'Student Application',
  partner: 'Partner Application',
  employer: 'Employer Application',
};

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  await requireRole(['admin', 'super_admin']);
  const { type, id } = await params;

  const db = await getAdminClient();

  // Query directly from applications table — admin_applications_queue is a stub
  const { data: application, error } = await db
    .from('applications')
    .select('id, status, user_id, program_slug, program_interest, email, first_name, last_name, full_name, phone, created_at, updated_at, funding_verified, payment_received_at, eligibility_status, has_workone_approval, notes, address, city, state, zip, dob, ssn_last4, employment_status, education_level, referred_by')
    .eq('id', id)
    .maybeSingle();

  if (error || !application) {
    notFound();
  }

  const firstName = application.first_name || application.full_name?.split(' ')[0] || '';
  const lastName = application.last_name || application.full_name?.split(' ').slice(1).join(' ') || '';
  const email = application.email || '';
  const phone = application.phone || '';
  const displayName = firstName || lastName ? `${firstName} ${lastName}`.trim() : 'Unknown Applicant';

  // Fetch state history from audit_logs
  const { data: stateEvents } = await db
    .from('audit_logs')
    .select('id, metadata, actor_id, actor_role, created_at')
    .eq('entity_type', 'application')
    .eq('entity_id', id)
    .eq('action', 'status_transition')
    .order('created_at', { ascending: true });

  // Fetch eligibility review if exists
  const { data: eligibilityReview } = await db
    .from('application_eligibility_reviews')
    .select('*')
    .eq('application_id', id)
    .maybeSingle();

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Image */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <Breadcrumbs
          items={[
            { label: 'Admin', href: '/admin' },
            { label: 'Applications', href: '/admin/applications' },
            { label: displayName },
          ]}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{displayName}</h1>
              <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700">
                {typeLabels[type] || type}
              </span>
            </div>
            <p className="text-gray-600">{email}</p>
          </div>
          <div className="flex gap-3">
            <span
              className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${stateColors[application.status] || 'bg-gray-100 text-gray-800 border-gray-300'}`}
            >
              {stateLabels[application.status] || application.status}
            </span>
            <Link
              href="/admin/applications"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              Back to List
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Eligibility Review — full width above main content */}
          {(eligibilityReview || type === 'student') && (
            <div className="lg:col-span-3">
              <EligibilityReviewPanel
                review={eligibilityReview ?? null}
                applicationId={id}
              />
            </div>
          )}

          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                  <dd className="text-sm text-gray-900">{displayName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="text-sm text-gray-900">{email || 'Not provided'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="text-sm text-gray-900">{phone || 'Not provided'}</dd>
                </div>
              </dl>
            </div>

            {/* Application Data */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Application Data</h2>
              <dl className="grid grid-cols-2 gap-4">
                {[
                  ['Program', application.program_slug || application.program_interest || 'Not provided'],
                  ['Address', application.address || 'Not provided'],
                  ['City', application.city || 'Not provided'],
                  ['State', application.state || 'Not provided'],
                  ['ZIP', application.zip || 'Not provided'],
                  ['Date of Birth', application.dob || 'Not provided'],
                  ['SSN Last 4', application.ssn_last4 || 'Not provided'],
                  ['Employment Status', application.employment_status || 'Not provided'],
                  ['Education Level', application.education_level || 'Not provided'],
                  ['Referred By', application.referred_by || 'Not provided'],
                  ['Funding Verified', application.funding_verified ? 'Yes' : 'No'],
                  ['Eligibility Status', application.eligibility_status || 'Not provided'],
                  ['WorkOne Approval', application.has_workone_approval ? 'Yes' : 'No'],
                  ['Notes', application.notes || '—'],
                ].map(([label, value]) => (
                  <div key={label as string}>
                    <dt className="text-sm font-medium text-gray-500">{label}</dt>
                    <dd className="text-sm text-gray-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions Card */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
              <TransitionButtons
                applicationType={type}
                applicationId={id}
                currentState={application.status}
              />
            </div>

            {/* Status Card */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Application Status</h2>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Type</dt>
                  <dd className="text-sm text-gray-900">{typeLabels[type] || type}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Current State</dt>
                  <dd className="mt-1">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${stateColors[application.status] || 'bg-gray-100 text-gray-800'}`}
                    >
                      {stateLabels[application.status] || application.status}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created</dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(application.created_at).toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                  <dd className="text-sm text-gray-900">
                    {application.updated_at ? new Date(application.updated_at).toLocaleString() : '-'}
                  </dd>
                </div>
              </dl>
            </div>

            {/* State History */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">State History</h2>
              {stateEvents && stateEvents.length > 0 ? (
                <div className="space-y-4">
                  {stateEvents.map((event, index) => {
                    const meta = (event.metadata as any) || {};
                    return (
                      <div
                        key={event.id}
                        className="relative pl-4 border-l-2 border-gray-200 pb-4 last:pb-0"
                      >
                        <div
                          className={`absolute -left-1.5 top-0 w-3 h-3 rounded-full ${
                            index === stateEvents.length - 1
                              ? 'bg-brand-blue-600'
                              : 'bg-gray-300'
                          }`}
                        />
                        <div className="text-sm">
                          <span className="text-xs text-gray-400">{meta.from || '—'}</span>
                          <span className="mx-1 text-gray-300">→</span>
                          <span
                            className={`inline-flex px-2 py-0.5 text-xs font-medium rounded ${stateColors[meta.to] || 'bg-gray-100 text-gray-800'}`}
                          >
                            {stateLabels[meta.to] || meta.to}
                          </span>
                          <p className="text-gray-500 mt-1 text-xs">
                            {meta.reason || 'State changed'} — {new Date(event.created_at).toLocaleString()}
                          </p>
                          {event.actor_role && (
                            <p className="text-gray-400 text-xs">by {event.actor_role}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No state history available.</p>
              )}
            </div>

            {/* Application ID */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Application ID</h2>
              <p className="text-xs font-mono text-gray-600 break-all">{id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
