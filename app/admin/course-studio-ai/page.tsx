import { Metadata } from 'next';
import { requireRole } from '@/lib/auth/require-role';
import { getAdminClient } from '@/lib/supabase/admin';
import Link from 'next/link';
import { Sparkles, BookOpen, Clock, CheckCircle, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'AI Course Studio | Admin | Elevate For Humanity',
  robots: { index: false, follow: false },
};

export default async function CourseStudioAIPage() {
  await requireRole(['admin', 'super_admin', 'staff']);
  const db = getAdminClient();

  // Show AI-generated courses (status = 'ai_draft' or created via generator)
  const { data: courses } = await db
    .from('courses')
    .select('id, title, slug, status, created_at, updated_at')
    .order('created_at', { ascending: false })
    .limit(30);

  const { data: programs } = await db
    .from('programs')
    .select('id, title, category')
    .eq('is_active', true)
    .order('title');

  const rows = courses ?? [];
  const programRows = programs ?? [];

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-slate-200 px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-500" /> AI Course Studio
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">Generate course content from syllabi, PDFs, or prompts</p>
          </div>
          <Link
            href="/admin/courses/generate"
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors"
          >
            <Sparkles className="w-4 h-4" /> Generate Course
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Generate from Syllabus', desc: 'Paste or upload a syllabus to auto-build a course structure.', href: '/admin/courses/generate?mode=syllabus', icon: BookOpen },
            { title: 'Generate from Prompt', desc: 'Describe a course topic and let AI build the outline.', href: '/admin/courses/generate?mode=prompt', icon: Sparkles },
            { title: 'AI Builder (Blueprint)', desc: 'Use the full blueprint-driven course builder with AI assist.', href: '/admin/courses/ai-builder', icon: CheckCircle },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} href={action.href} className="group bg-white rounded-xl border border-slate-200 p-6 hover:border-purple-300 hover:shadow-sm transition-all">
                <Icon className="w-8 h-8 text-purple-500 mb-3" />
                <h3 className="font-semibold text-slate-900 mb-1">{action.title}</h3>
                <p className="text-sm text-slate-500 mb-3">{action.desc}</p>
                <span className="inline-flex items-center gap-1 text-sm text-purple-600 font-medium group-hover:gap-2 transition-all">
                  Start <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            );
          })}
        </div>

        {/* Available programs to generate for */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">Active Programs ({programRows.length})</h2>
            <p className="text-xs text-slate-400 mt-0.5">Select a program to generate course content for</p>
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

        {/* Recent courses */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">Recent Courses ({rows.length})</h2>
          </div>
          {rows.length === 0 ? (
            <div className="p-8 text-center text-slate-400">No courses yet.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {rows.map((c) => (
                <div key={c.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div>
                    <div className="font-medium text-slate-900">{c.title}</div>
                    <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      Updated {new Date(c.updated_at).toLocaleDateString()}
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        c.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>{c.status}</span>
                    </div>
                  </div>
                  <Link href={`/admin/courses/${c.id}`} className="text-sm text-blue-600 hover:underline">Edit</Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
