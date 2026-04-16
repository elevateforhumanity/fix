import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { getAdminClient } from '@/lib/supabase/admin';
import { canAccessRoute, getUnauthorizedRedirect } from '@/lib/auth/lms-routes';
import { requireUser } from '@/lib/auth/require-user';
import { LmsAppShell } from './LmsAppShell';

export const dynamic = 'force-dynamic';

export default async function LmsAppLayout({ children }: { children: ReactNode }) {
  // Single server-side gate — redirects to /login?redirect=<path> if unauthenticated.
  const authUser = await requireUser();

  const db = await getAdminClient();
  if (!db) throw new Error('Admin client failed to initialize');

  const user = { id: authUser.id, email: authUser.email };
  const profile = authUser.profile as Record<string, unknown> & { role?: string };

  // Role-based LMS access check
  if (profile?.role && !canAccessRoute('/lms', profile.role)) {
    redirect(getUnauthorizedRedirect(profile.role));
  }

  // Gate LMS access — students must have admin-granted access before entering the LMS.
  // access_granted_at is set by admin via /admin/enrollments grant-access action.
  if (profile?.role === 'student') {
    const { data: enrollment } = await db
      .from('program_enrollments')
      .select('access_granted_at, onboarding_completed_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!enrollment?.access_granted_at) {
      // Fallback: HVAC and other legacy students are enrolled via training_enrollments
      // (pre-dates program_enrollments). approved_at serves the same gate role.
      const { data: legacyEnrollment } = await db
        .from('training_enrollments')
        .select('approved_at, status')
        .eq('user_id', user.id)
        .order('enrolled_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      const legacyActive =
        !!legacyEnrollment?.approved_at ||
        legacyEnrollment?.status === 'active';

      if (!legacyActive) {
        // Not yet granted — send to student portal with pending state
        redirect('/learner/dashboard?access=pending');
      }
    }
  }

  // Serialize user/profile for client component
  const serializedUser = {
    id: user.id,
    email: user.email,
    user_metadata: (profile as Record<string, unknown>)?.user_metadata ?? {},
  };

  return (
    <LmsAppShell user={serializedUser} profile={profile}>
      {children}
    </LmsAppShell>
  );
}
