import type { Metadata } from 'next';
import { getProgramsByCategory } from '@/lib/lms/api';
import SkilledTradesPageClient from './SkilledTradesPageClient';

export const revalidate = 600;

export const metadata: Metadata = {
  title: 'Skilled Trades Programs | Elevate for Humanity',
  description: 'Free WIOA-funded skilled trades training in HVAC, Welding, CDL, and more for eligible Indiana residents.',
};

export default async function SkilledTradesProgramsPage() {
  const programs = await getProgramsByCategory('trades');
  return <SkilledTradesPageClient programs={programs} />;
}
