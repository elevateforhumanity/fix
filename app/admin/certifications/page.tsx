import { Metadata } from 'next';
import { requireRole } from '@/lib/auth/require-role';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { getAdminClient } from '@/lib/supabase/admin';
import Link from 'next/link';
import Image from 'next/image';
import { CertificationReviewPanel } from '@/components/admin/CertificationReviewPanel';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  alternates: {
    canonical: 'https://www.elevateforhumanity.org/admin/certifications',
  },
  title: 'Certifications Management | Elevate For Humanity',
  description:
    'Manage certifications, credentials, and professional licenses for students and programs.',
};

export default async function CertificationsPage() {
  await requireRole(['admin', 'super_admin']);
  const db = await getAdminClient();

  const [pendingRes, recentRes] = await Promise.all([
    db
      .from('certification_submissions')
      .select('*, profiles(id, full_name, email), programs(id, name)')
      .eq('status', 'pending_review')
      .order('created_at', { ascending: false })
      .limit(20),
    db
      .from('certification_submissions')
      .select('*, profiles(id, full_name, email), programs(id, name)')
      .in('status', ['approved', 'rejected'])
      .order('reviewed_at', { ascending: false })
      .limit(10),
  ]);

  const pendingSubmissions = pendingRes.data ?? [];
  const recentSubmissions = recentRes.data ?? [];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Certifications' }]} />
      </div>

      <section className="relative h-48 md:h-64 overflow-hidden">
        <Image
          src="/images/pages/admin-certifications-detail.jpg"
          alt="Certifications Management"
          fill
          className="object-cover"
          quality={100}
          priority
          sizes="100vw"
        />
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Certifications</h1>
              <p className="text-slate-600 mt-1">
                Review and approve student certification submissions.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/admin/reports"
                className="px-4 py-2 border rounded-lg text-sm font-medium text-slate-700 hover:bg-gray-50"
              >
                View Reports
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-sm font-medium text-slate-600 mb-2">Pending Review</h3>
              <p className="text-3xl font-bold text-amber-600">{pendingSubmissions.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-sm font-medium text-slate-600 mb-2">Recently Approved</h3>
              <p className="text-3xl font-bold text-brand-green-600">
                {recentSubmissions.filter((s: any) => s.status === 'approved').length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-sm font-medium text-slate-600 mb-2">Recently Rejected</h3>
              <p className="text-3xl font-bold text-red-600">
                {recentSubmissions.filter((s: any) => s.status === 'rejected').length}
              </p>
            </div>
          </div>

          <CertificationReviewPanel
            pendingSubmissions={pendingSubmissions}
            recentSubmissions={recentSubmissions}
          />
        </div>
      </section>
    </div>
  );
}
