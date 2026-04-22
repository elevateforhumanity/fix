import { redirect } from 'next/navigation';

// AI generation is now embedded in /admin/programs/builder?tab=ai
export default function Page() {
  redirect('/admin/programs/builder?tab=ai');
}
