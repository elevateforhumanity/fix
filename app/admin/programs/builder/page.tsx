import { Metadata } from 'next';
import { requireRole } from '@/lib/auth/require-role';
import { getAdminClient } from '@/lib/supabase/admin';
import Link from 'next/link';
import { Layers, Plus, ArrowRight, BookOpen, Users } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Program Builder | Admin | Elevate For Humanity',
  robots: { index: false, follow: false },
};

export default async function ProgramBuilderPage() {
  await requireRole(['admin', 'super_admin']);
  const db = getAdminClient();

  const [{ data: programs }, { data: courses }] = await Promise.all([
    db.from('programs')
      .select('id, title, slug, category, is_active, published, created_at')
      .order('created_at', { ascending: false })
      .limit(30),
    db.from('courses')
      .select('id, title, program_id, status')
      .order('created_at', { ascending: false }),
  ]);

  const rows = programs ?? [];
  const courseRows = courses ?? [];

  // Count courses per program
  const courseCountMap: Record<string, number> = {};
  for (const c of courseRows) {
    if (c.program_id) courseCountMap[c.program_id] = (courseCountMap[c.program_id] ?? 0) + 1;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-slate-200 px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-6 h-6 text-blue-600" /> Program Builder
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">Create and structure training programs</p>
          </div>
          <Link
            href="/admin/programs/new"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> New Program
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Create Program', desc: 'Define a new training program with modules and credentials.', href: '/admin/programs/new', icon: Plus },
            { title: 'Blueprint Builder', desc: 'Use a CredentialBlueprint to auto-generate course structure.', href: '/admin/course-builder', icon: Layers },
            { title: 'AI Course Generator', desc: 'Generate course content from a syllabus or prompt.', href: '/admin/courses/generate', icon: BookOpen },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} href={action.href} className="group bg-white rounded-xl border border-slate-200 p-6 hover:border-blue-300 hover:shadow-sm transition-all">
                <Icon className="w-7 h-7 text-blue-500 mb-3" />
                <h3 className="font-semibold text-slate-900 mb-1">{action.title}</h3>
                <p className="text-sm text-slate-500 mb-3">{action.desc}</p>
                <span className="inline-flex items-center gap-1 text-sm text-blue-600 font-medium group-hover:gap-2 transition-all">
                  Open <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            );
          })}
        </div>

        {/* Programs list */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">All Programs ({rows.length})</h2>
          </div>
          {rows.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              No programs yet. <Link href="/admin/programs/new" className="text-blue-600 hover:underline">Create one</Link>.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-3 text-left">Title</th>
                    <th className="px-6 py-3 text-left">Category</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-right">Courses</th>
                    <th className="px-6 py-3 text-left">Created</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rows.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{p.title}</td>
                      <td className="px-6 py-4 text-slate-500">{p.category}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          p.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>{p.published ? 'Published' : 'Draft'}</span>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-slate-700">
                        {courseCountMap[p.id] ?? 0}
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-xs">{new Date(p.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Link href={`/admin/programs/${p.id}`} className="text-blue-600 hover:underline text-sm">Edit</Link>
                          <Link href={`/admin/programs/${p.slug ?? p.id}/dashboard`} className="text-slate-500 hover:underline text-sm">Dashboard</Link>
                        </div>
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
