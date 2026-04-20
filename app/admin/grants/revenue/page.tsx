import { Metadata } from 'next';
import { requireRole } from '@/lib/auth/require-role';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  alternates: { canonical: 'https://www.elevateforhumanity.org/admin/grants/revenue' },
  title: 'Grant Revenue | Elevate For Humanity',
  description: 'Track grant revenue and funding allocations.',
};

function formatCurrency(cents: number): string {
  if (cents >= 1_000_000) return `$${(cents / 1_000_000).toFixed(1)}M`;
  if (cents >= 1_000) return `$${(cents / 1_000).toFixed(0)}K`;
  return `$${cents.toFixed(0)}`;
}

export default async function GrantRevenuePage() {
  await requireRole(['admin', 'super_admin']);
  const supabase = await createClient();

  const { data: applications } = await supabase
    .from('grant_applications')
    .select('status, amount_requested, amount_awarded');

  const totalAwarded = (applications ?? [])
    .filter((a) => a.status === 'approved' && a.amount_awarded != null)
    .reduce((sum, a) => sum + Number(a.amount_awarded ?? 0), 0);

  const totalPending = (applications ?? [])
    .filter((a) => ['submitted', 'under_review'].includes(a.status) && a.amount_requested != null)
    .reduce((sum, a) => sum + Number(a.amount_requested ?? 0), 0);

  const activeCount = (applications ?? []).filter((a) =>
    ['submitted', 'under_review'].includes(a.status)
  ).length;

  const approvedApplications = (applications ?? []).filter((a) => a.status === 'approved');

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <nav className="text-sm mb-4">
            <ol className="flex items-center space-x-2 text-slate-500">
              <li><Link href="/admin" className="hover:text-slate-900">Admin</Link></li>
              <li>/</li>
              <li><Link href="/admin/grants" className="hover:text-slate-900">Grants</Link></li>
              <li>/</li>
              <li className="text-slate-900 font-medium">Revenue</li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold text-slate-900">Grant Revenue</h1>
          <p className="text-slate-600 mt-2">Track funding and revenue from grant applications</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-sm font-medium text-slate-500">Total Awarded</h3>
            <p className="text-3xl font-bold text-brand-green-600 mt-2">
              {totalAwarded > 0 ? formatCurrency(totalAwarded) : '—'}
            </p>
            <p className="text-xs text-slate-400 mt-1">{approvedApplications.length} approved</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-sm font-medium text-slate-500">Pending</h3>
            <p className="text-3xl font-bold text-yellow-600 mt-2">
              {totalPending > 0 ? formatCurrency(totalPending) : '—'}
            </p>
            <p className="text-xs text-slate-400 mt-1">under review</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-sm font-medium text-slate-500">Active Applications</h3>
            <p className="text-3xl font-bold text-brand-blue-600 mt-2">{activeCount}</p>
            <p className="text-xs text-slate-400 mt-1">submitted or under review</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-sm font-medium text-slate-500">Total Applications</h3>
            <p className="text-3xl font-bold text-slate-700 mt-2">{(applications ?? []).length}</p>
            <p className="text-xs text-slate-400 mt-1">all time</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Revenue Breakdown</h2>
          {approvedApplications.length === 0 ? (
            <p className="text-slate-500">No approved grant applications on record.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-slate-500">
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium text-right">Requested</th>
                  <th className="pb-2 font-medium text-right">Awarded</th>
                </tr>
              </thead>
              <tbody>
                {approvedApplications.map((a, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-2 capitalize text-slate-700">{a.status}</td>
                    <td className="py-2 text-right text-slate-600">
                      {a.amount_requested != null ? `$${Number(a.amount_requested).toLocaleString()}` : '—'}
                    </td>
                    <td className="py-2 text-right font-medium text-brand-green-600">
                      {a.amount_awarded != null ? `$${Number(a.amount_awarded).toLocaleString()}` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
