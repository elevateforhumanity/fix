import type { Metadata } from 'next';
import { getProgramsByCategory } from '@/lib/lms/api';
import TechnologyPageClient from './TechnologyPageClient';

export const revalidate = 600;

export const metadata: Metadata = {
  title: 'Technology Programs | Elevate for Humanity',
  description: 'Free WIOA-funded technology training in IT Support, Cybersecurity, and more for eligible Indiana residents.',
};

export default async function TechnologyProgramsPage() {
  const programs = await getProgramsByCategory('technology');
  return <TechnologyPageClient programs={programs} />;
}
