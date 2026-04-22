import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  alternates: { canonical: 'https://www.elevateforhumanity.org/lms/builder' },
  title: 'Course Builder | Elevate For Humanity',
  description: 'Build and customize course content.',
};

const CourseAuthoringTool = dynamic(
  () => import('@/components/lms/CourseAuthoringTool'),
  { ssr: false }
);

export default async function BuilderPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?redirect=/lms/builder');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (!['instructor', 'admin', 'super_admin', 'staff'].includes(profile?.role ?? '')) {
    redirect('/unauthorized');
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <nav className="text-sm mb-4">
            <ol className="flex items-center space-x-2 text-slate-700">
              <li><Link href="/lms/dashboard" className="hover:text-primary">LMS</Link></li>
              <li>/</li>
              <li className="text-slate-900 font-medium">Course Builder</li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold text-slate-900">Course Builder</h1>
          <p className="text-slate-600 mt-1">Drag and drop to build course structure. Save to DB via Admin → Curriculum.</p>
        </div>
        <CourseAuthoringTool />
      </div>
    </div>
  );
}
