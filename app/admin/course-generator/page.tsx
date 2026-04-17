export const dynamic = 'force-static';
export const revalidate = 3600;

import { redirect } from 'next/navigation';

// Superseded by /admin/courses/generate — redirect permanently
export default function CourseGeneratorRedirect() {
  redirect('/admin/courses/generate');
}
