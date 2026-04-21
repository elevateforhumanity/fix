import { Metadata } from 'next';
import { requireRole } from '@/lib/auth/require-role';
import { getAdminClient } from '@/lib/supabase/admin';
import Link from 'next/link';
import { BookOpen, Plus, Edit3, Eye, Layers } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Course Studio | Admin | Elevate For Humanity',
  robots: { index: false, follow: false },
};

export default async function CourseStudioPage() {
  await requireRole(['admin', 'super_admin', 'staff']);
  const db = getAdminClient();

  const { data: courses } = await db
    .from('courses')
    .select('id, title, slug, status, is_active, created_at, updated_at, program_id')
    .order('updated_at', { ascending: false })
    .limit(50);

  const { data: programs } = await db
    .from('programs')
    .select('id, title');

  const rows = courses ?? [];
  const programMap: Record<string, string> = {};
  for (const p of programs ?? []) programMap[p.id] = p.title;

  const draftCount = rows.filter((c) => c.status === 'draft').length;
  const publishedCount = rows.filter((c) => c.status === 'published').length;

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-slate-200 px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Course Studio</h1>
            <p className="text-slate-500 text-sm mt-0.5">Create and manage course content</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/course-builder" className="inline-flex items-center gap-2 border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">
              <Layers className="w-4 h-4" /> Blueprint Builder
            </Link>
            <Link href="/admin/courses/create" className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" /> New Course
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Courses', value: rows.length },
            { label: 'Published', value: publishedCount },
            { label: 'Drafts', value: draftCount },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-5 text-center">
              <p className="text-3xl font-bold text-blue-600">{s.value}</p>
              <p className="text-sm text-slate-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-800">All Courses</h2>
          </div>
          {rows.length === 0 ? (
            <div className="p-12 text-center text-slate-400">No courses yet. <Link href="/admin/courses/create" className="text-blue-600 hover:underline">Create one</Link>.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-3 text-left">Title</th>
                    <th className="px-6 py-3 text-left">Program</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Updated</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rows.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{c.title}</td>
                      <td className="px-6 py-4 text-slate-500">{c.program_id ? (programMap[c.program_id] ?? '—') : '—'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          c.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>{c.status}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-xs">{new Date(c.updated_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Link href={`/admin/courses/${c.id}`} className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm"><Edit3 className="w-3.5 h-3.5" />Edit</Link>
                          <Link href={`/lms/courses/${c.id}`} className="inline-flex items-center gap-1 text-slate-500 hover:underline text-sm"><Eye className="w-3.5 h-3.5" />Preview</Link>
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
