import { Metadata } from 'next';
import { requireRole } from '@/lib/auth/require-role';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { EmployerProposalPreview } from '@/components/admin/EmployerProposalPreview';
import type { Employer } from '@/lms-data/employers';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Employer Proposal | Elevate For Humanity',
  description: 'View and manage employer partnership proposals.',
};

export default async function EmployerProposalPage({ params }: { params: { id: string } }) {
  await requireRole(['admin', 'super_admin']);
  const supabase = await createClient();

  const { data: row } = await supabase
    .from('employers')
    .select('*')
    .eq('id', params.id)
    .maybeSingle();

  // Adapt DB row to the static Employer interface expected by EmployerProposalPreview
  const employer: Employer | null = row
    ? {
        id: row.id,
        name: row.company_name ?? row.name ?? 'Unknown Employer',
        contactName: row.contact_name ?? row.primary_contact_name ?? undefined,
        contactEmail: row.contact_email ?? row.email ?? undefined,
        contactPhone: row.contact_phone ?? row.phone ?? undefined,
        city: row.city ?? undefined,
        state: row.state ?? undefined,
        website: row.website ?? undefined,
        notes: row.notes ?? undefined,
        interestedPrograms: row.interested_programs ?? [],
        tags: row.tags ?? [],
        wantsWex: row.wants_wex ?? false,
        wantsOjt: row.wants_ojt ?? false,
        wantsApprenticeship: row.wants_apprenticeship ?? false,
      }
    : null;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <nav className="text-sm mb-4">
            <ol className="flex items-center space-x-2 text-slate-700">
              <li><Link href="/admin" className="hover:text-primary">Admin</Link></li>
              <li>/</li>
              <li><Link href="/admin/employers" className="hover:text-primary">Employers</Link></li>
              <li>/</li>
              <li className="text-slate-900 font-medium">Proposal</li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold text-slate-900">Partnership Proposal</h1>
          <p className="text-slate-700 mt-2">{employer?.name ?? 'Employer'}</p>
        </div>

        {employer ? (
          <EmployerProposalPreview employer={employer} />
        ) : (
          <div className="bg-white rounded-lg shadow-sm border p-6 text-center text-slate-500">
            Employer not found.
          </div>
        )}
      </div>
    </div>
  );
}
