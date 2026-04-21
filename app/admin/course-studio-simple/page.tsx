import { Metadata } from 'next';
import { requireRole } from '@/lib/auth/require-role';
import { getAdminClient } from '@/lib/supabase/admin';
import Link from 'next/link';
import { BookOpen, Plus, Edit3, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Simple Course Editor | Admin | Elevate For Humanity',
  robots: { index: false, follow: false },
};

export default async function CourseStudioSimplePage() {
  await requireRole(['admin', 'super_admin', 'staff', 'instructor']);
  const db = getAdminClient();

  // Show draft courses — the simple editor is for quick edits on in-progress content
  const { data: courses } = await db
    .from('courses')
    .select('id, title, slug, status, updated_at, program_id')
    .in('status', ['draft', 'review'])
    .order('updated_at', { ascending: false })
    .limit(50);

  const { data: lessons } = await db
    .from('course_lessons')
    .select('id, title, lesson_type, status, course_id')
    .in('status', ['draft', 'review'])
    .order('created_at', { ascending: false })
    .limit(50);

  const rows = courses ?? [];
  const lessonRows = lessons ?? [];

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-slate-200 px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Simple Course Editor</h1>
            <p className="text-slate-500 text-sm mt-0.5">Quick edits for draft courses and lessons</p>
          </div>
          <Link href="/admin/courses/create" className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" /> New Course
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Draft courses */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-500" /> Draft Courses ({rows.length})
            </h2>
          </div>
          {rows.length === 0 ? (
            <div className="p-8 text-center text-slate-400">No draft courses.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {rows.map((c) => (
                <div key={c.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div>
                    <div className="font-medium text-slate-900">{c.title}</div>
                    <div className="text-xs text-slate-400 mt-0.5">Updated {new Date(c.updated_at).toLocaleDateString()}</div>
                  </div>
                  <Link href={`/admin/courses/${c.id}`} className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline">
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Draft lessons */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-500" /> Draft Lessons ({lessonRows.length})
            </h2>
          </div>
          {lessonRows.length === 0 ? (
            <div className="p-8 text-center text-slate-400">No draft lessons.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {lessonRows.map((l) => (
                <div key={l.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div>
                    <div className="font-medium text-slate-900">{l.title}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{l.lesson_type} · {l.status}</div>
                  </div>
                  <Link href={`/admin/courses/${l.course_id}/lessons/${l.id}`} className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline">
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
