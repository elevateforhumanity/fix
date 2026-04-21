import { Metadata } from 'next';
import { requireRole } from '@/lib/auth/require-role';
import { getAdminClient } from '@/lib/supabase/admin';
import Link from 'next/link';
import { Sparkles, ArrowRight, BookOpen, Layers } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Course Generator | Admin | Elevate For Humanity',
  robots: { index: false, follow: false },
};

export default async function CourseGeneratorPage() {
  await requireRole(['admin', 'super_admin', 'staff']);
  const db = getAdminClient();

  const [{ data: programs }, { data: recentCourses }] = await Promise.all([
    db.from('programs').select('id, title, category, slug').eq('is_active', true).order('title'),
    db.from('courses').select('id, title, status, created_at').order('created_at', { ascending: false }).limit(10),
  ]);

  const programRows = programs ?? [];
  const courseRows = recentCourses ?? [];

  const GENERATION_MODES = [
    { id: 'syllabus', label: 'From Syllabus', desc: 'Upload or paste a syllabus — AI extracts modules and lessons.', href: '/admin/courses/generate?mode=syllabus' },
    { id: 'prompt', label: 'From Prompt', desc: 'Describe the course topic and target audience.', href: '/admin/courses/generate?mode=prompt' },
    { id: 'pdf', label: 'From PDF / DOCX', desc: 'Upload a document and generate a full course outline.', href: '/admin/courses/generate?mode=upload' },
    { id: 'blueprint', label: 'From Blueprint', desc: 'Use a CredentialBlueprint to seed a structured program.', href: '/admin/course-builder' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-slate-200 px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-500" /> Course Generator
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">Generate structured courses from content or prompts</p>
          </div>
          <Link
            href="/admin/courses/generate"
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors"
          >
            <Sparkles className="w-4 h-4" /> Open Generator
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Generation modes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {GENERATION_MODES.map((mode) => (
            <Link
              key={mode.id}
              href={mode.href}
              className="group bg-white rounded-xl border border-slate-200 p-6 hover:border-purple-300 hover:shadow-sm transition-all"
            >
              <h3 className="font-semibold text-slate-900 mb-1">{mode.label}</h3>
              <p className="text-sm text-slate-500 mb-4">{mode.desc}</p>
              <span className="inline-flex items-center gap-1 text-sm text-purple-600 font-medium group-hover:gap-2 transition-all">
                Start <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          ))}
        </div>

        {/* Programs to generate for */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-400" />
            <h2 className="font-semibold text-slate-800">Generate for a Program</h2>
          </div>
          {programRows.length === 0 ? (
            <div className="p-8 text-center text-slate-400">No active programs.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {programRows.map((p) => (
                <div key={p.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div>
                    <div className="font-medium text-slate-900">{p.title}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{p.category}</div>
                  </div>
                  <Link
                    href={`/admin/courses/generate?program=${p.id}`}
                    className="inline-flex items-center gap-1.5 text-sm text-purple-600 hover:underline"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Generate
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recently generated */}
        {courseRows.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-slate-400" />
              <h2 className="font-semibold text-slate-800">Recently Created Courses</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {courseRows.map((c) => (
                <div key={c.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div>
                    <div className="font-medium text-slate-900">{c.title}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{new Date(c.created_at).toLocaleDateString()}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      c.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>{c.status}</span>
                    <Link href={`/admin/courses/${c.id}`} className="text-sm text-blue-600 hover:underline">Edit</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
