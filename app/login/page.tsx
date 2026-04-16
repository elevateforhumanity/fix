import { redirect } from 'next/navigation';
import { requireGuestOrGetUserHome } from '@/lib/auth/require-guest-or-get-user-home';
import LoginClient from './LoginClient';

export const dynamic = 'force-dynamic';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; next?: string }>;
}) {
  const params = await searchParams;
  const redirectTo = params.redirect || params.next || '';

  // Bounce already-authenticated users to their home dashboard.
  // If a ?redirect param is present, honour it instead.
  const userHome = await requireGuestOrGetUserHome();
  if (userHome) {
    redirect(redirectTo || userHome);
  }

  return <LoginClient redirectTo={redirectTo} />;
}
