import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import FundingConfirmClient from './FundingConfirmClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Confirm Funding Source | Elevate for Humanity',
  robots: { index: false, follow: false },
};

export default async function FundingConfirmPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?redirect=/funding/confirm');

  const { data: profile } = await supabase
    .from('profiles')
    .select('funding_source, funding_confirmed')
    .eq('id', user.id)
    .maybeSingle();

  return (
    <FundingConfirmClient
      currentFundingSource={profile?.funding_source ?? null}
      alreadyConfirmed={!!profile?.funding_confirmed}
    />
  );
}
