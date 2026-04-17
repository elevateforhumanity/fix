import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import ProgramHolderSettingsForm from './SettingsForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  alternates: { canonical: 'https://www.elevateforhumanity.org/program-holder/settings' },
  title: 'Program Settings | Elevate For Humanity',
  description: 'Configure your program holder account settings.',
};

export default async function ProgramSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const db = await getAdminClient();
  const { data: profile } = await db.from('profiles').select('*').eq('id', user.id).maybeSingle();
  if (!profile || !['program_holder', 'admin', 'super_admin', 'staff'].includes(profile.role)) {
    redirect('/login');
  }

  const { data: holder } = await db
    .from('program_holders')
    .select('notify_enrollments, notify_weekly_reports')
    .eq('user_id', user.id)
    .maybeSingle();

  return (
    <ProgramHolderSettingsForm
      organization={profile.organization ?? ''}
      email={profile.email ?? ''}
      notifyEnrollments={holder?.notify_enrollments ?? true}
      notifyWeeklyReports={holder?.notify_weekly_reports ?? true}
    />
  );
}
